import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { build, defineConfig, type Plugin } from 'vite';

/**
 * Ficheros fuente que componen cada ruta. Sirven para calcular el <lastmod>
 * real del sitemap: la fecha del último commit que tocó esa página, no la fecha
 * del build. Un sitemap con la fecha de hoy en todas las URLs es señal falsa.
 */
const ROUTE_SOURCES: Record<string, string[]> = {
  '/': [
    'src/components/Home.tsx',
    'src/components/Hero.tsx',
    'src/components/Origin.tsx',
    'src/components/Concept.tsx',
    'src/components/Execution.tsx',
    'src/components/Footer.tsx',
  ],
  '/reformas': ['src/components/ReformasLanding.tsx', 'src/components/Footer.tsx'],
  '/studio': ['src/components/StudioLanding.tsx', 'src/components/Footer.tsx'],
  '/contacto': ['src/components/Contact.tsx'],
  '/aviso-legal': ['src/components/AvisoLegal.tsx'],
  '/politica-de-privacidad': ['src/components/PoliticaPrivacidad.tsx'],
  '/politica-de-cookies': ['src/components/PoliticaCookies.tsx'],
};

const SSR_OUT = '.prerender-ssr';

/** Fecha (YYYY-MM-DD) del último commit que tocó alguno de estos ficheros. */
function lastCommitDate(files: string[]): string | null {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', ...files, 'src/seo.ts'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    // Sin git (o clone sin historia) no hay fecha real. Se omite <lastmod>
    // antes que estampar la fecha de hoy, que sería mentira.
    return null;
  }
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function replaceTag(html: string, pattern: RegExp, replacement: string): string {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`);
}

/**
 * Pre-render estático en el build.
 *
 * Por qué así y no con vite-react-ssg ni Puppeteer: el router es JSX (<Routes>),
 * no un array enumerable, así que vite-react-ssg no encaja sin reescribirlo; y
 * Puppeteer obligaría a descargar un Chromium en el build de Vercel. Con
 * renderToString sobre un build SSR de Vite no hace falta ni navegador ni
 * dependencia nueva: react-dom ya está en el proyecto.
 *
 * Corre en el build de Vercel, dentro de `vite build`, después de emitir el
 * bundle de cliente.
 */
function prerenderPlugin(): Plugin {
  return {
    name: 'gaos-prerender',
    apply: 'build',
    enforce: 'post',
    async closeBundle() {
      if (process.env.GAOS_SSR_BUILD === '1') return; // no recursar en el build SSR

      const distDir = path.resolve(__dirname, 'dist');
      const templatePath = path.join(distDir, 'index.html');
      const template = fs.readFileSync(templatePath, 'utf8');

      // 1 · compilar la app para Node
      process.env.GAOS_SSR_BUILD = '1';
      try {
        await build({
          configFile: false,
          logLevel: 'warn',
          plugins: [react(), tailwindcss()],
          resolve: { alias: { '@': path.resolve(__dirname, '.') } },
          build: {
            ssr: path.resolve(__dirname, 'src/entry-server.tsx'),
            outDir: SSR_OUT,
            emptyOutDir: true,
            rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
          },
        });
      } finally {
        delete process.env.GAOS_SSR_BUILD;
      }

      const entry = path.resolve(__dirname, SSR_OUT, 'entry-server.mjs');
      const { render, ROUTES, canonicalUrl, OG_IMAGE, schemasForRoute, SITE_ORIGIN } =
        await import(`file://${entry}?t=${Date.now()}`);

      const sitemapEntries: string[] = [];

      for (const route of ROUTES) {
        const url = canonicalUrl(route.path);
        let html = template;

        html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);
        html = replaceTag(
          html,
          /<meta\s+name="description"[^>]*>/,
          `<meta name="description" content="${escapeAttr(route.description)}" />`
        );
        html = replaceTag(
          html,
          /<link\s+rel="canonical"[^>]*>/,
          `<link rel="canonical" href="${url}" />`
        );
        html = replaceTag(
          html,
          /<meta\s+property="og:title"[^>]*>/,
          `<meta property="og:title" content="${escapeAttr(route.title)}" />`
        );
        html = replaceTag(
          html,
          /<meta\s+property="og:description"[^>]*>/,
          `<meta property="og:description" content="${escapeAttr(route.description)}" />`
        );
        html = replaceTag(
          html,
          /<meta\s+property="og:url"[^>]*>/,
          `<meta property="og:url" content="${url}" />`
        );
        html = replaceTag(
          html,
          /<meta\s+property="og:image"[^>]*>/,
          `<meta property="og:image" content="${OG_IMAGE}" />`
        );
        html = replaceTag(
          html,
          /<meta\s+property="og:type"[^>]*>/,
          `<meta property="og:type" content="${route.ogType}" />`
        );

        const schemas = schemasForRoute(route)
          .map(
            (s: object) =>
              `    <script type="application/ld+json">${JSON.stringify(s, null, 2)}</script>`
          )
          .join('\n');
        if (schemas) html = html.replace('</head>', `${schemas}\n  </head>`);

        const appHtml = render(route.path);
        html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

        const outFile =
          route.path === '/'
            ? templatePath
            : path.join(distDir, route.path.slice(1), 'index.html');
        fs.mkdirSync(path.dirname(outFile), { recursive: true });
        fs.writeFileSync(outFile, html);

        const lastmod = lastCommitDate(ROUTE_SOURCES[route.path] ?? []);
        sitemapEntries.push(
          `  <url>\n    <loc>${url}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
        );
        this.info?.(`pre-render ${route.path} -> ${path.relative(__dirname, outFile)}`);
      }

      // 2 · sitemap.xml y robots.txt, generados de la misma lista de rutas.
      //     Sin changefreq ni priority: Google los ignora desde hace años.
      fs.writeFileSync(
        path.join(distDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`
      );
      fs.writeFileSync(
        path.join(distDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
      );

      fs.rmSync(path.resolve(__dirname, SSR_OUT), { recursive: true, force: true });

      // 3 · validar lo emitido. Si algo incumple (title > 60, description > 160,
      //     canonical que no toca, tipo de schema prohibido, rastro del host
      //     secundario...) el build se cae aquí y no llega a desplegarse.
      for (const script of ['scripts/check-routes.mjs', 'scripts/check-seo.mjs']) {
        try {
          const out = execFileSync(process.execPath, [script], { encoding: 'utf8' });
          process.stdout.write(out);
        } catch (e: any) {
          process.stdout.write(e.stdout ?? '');
          process.stderr.write(e.stderr ?? '');
          throw new Error(`${script} ha fallado: el build se detiene.`);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), prerenderPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
