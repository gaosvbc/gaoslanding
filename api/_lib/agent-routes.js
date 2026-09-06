/**
 * Tabla de rutas y utilidades compartidas para las respuestas pensadas para
 * agentes (404 reales y negociación de contenido markdown).
 *
 * Se mantiene en JavaScript plano y sin dependencias para que la puedan
 * importar tanto las funciones serverless de Vercel (`api/*.ts`) como los
 * tests (`node --test tests/`).
 */

export const SITE_ORIGIN = 'https://gaosprojects.es';

/**
 * Rutas públicas que sirve la SPA. Cualquier ruta que no esté aquí debe
 * devolver un 404 real, nunca el shell de la aplicación con un 200.
 *
 * @typedef {{ path: string, markdown: string, title: string }} PageRoute
 * @type {PageRoute[]}
 */
export const PAGES = [
  { path: '/', markdown: '/index.md', title: "GAO'S — Diseño de interiores y reformas integrales en Madrid" },
  { path: '/reformas', markdown: '/reformas.md', title: 'Gaos Reformas — Reforma integral en Madrid' },
  { path: '/studio', markdown: '/studio.md', title: 'Gaos Studio — Diseño de interiores en Madrid' },
  { path: '/contacto', markdown: '/contacto.md', title: "Contacto — GAO'S" },
  { path: '/aviso-legal', markdown: '/aviso-legal.md', title: "Aviso Legal — GAO'S" },
  { path: '/politica-de-privacidad', markdown: '/politica-de-privacidad.md', title: "Política de Privacidad — GAO'S" },
  { path: '/politica-de-cookies', markdown: '/politica-de-cookies.md', title: "Política de Cookies — GAO'S" },
];

/** Ficheros legibles por máquinas que siempre existen. */
export const AGENT_FILES = ['/llms.txt', '/sitemap.xml', '/robots.txt'];

/** @param {string} pathname */
export function isKnownPage(pathname) {
  const normalized = normalizePath(pathname);
  return PAGES.some((page) => page.path === normalized);
}

/**
 * Quita la query string, el fragmento y la barra final sobrante.
 * @param {string} pathname
 */
export function normalizePath(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) return '/';
  let value = pathname.split('#')[0].split('?')[0];
  if (!value.startsWith('/')) value = `/${value}`;
  if (value.length > 1 && value.endsWith('/')) value = value.slice(0, -1);
  return value || '/';
}

/**
 * `true` cuando el cliente prefiere markdown (acceptmarkdown.com).
 * Los navegadores envían `text/html` y siguen recibiendo HTML; los agentes
 * que envían `text/markdown`, `text/plain` o un Accept comodín reciben markdown.
 *
 * @param {string | string[] | undefined | null} accept
 */
export function wantsMarkdown(accept) {
  const header = Array.isArray(accept) ? accept.join(',') : accept;
  if (!header) return true; // sin Accept: cliente no-navegador
  const value = header.toLowerCase();
  if (value.includes('text/markdown')) return true;
  if (value.includes('text/html')) return false;
  if (value.includes('application/xhtml+xml')) return false;
  return true;
}

/**
 * Sanea la ruta pedida antes de reflejarla en una respuesta.
 * @param {string} pathname
 */
export function safePath(pathname) {
  const normalized = normalizePath(pathname);
  return normalized.replace(/[^\w\-./%~:@+]/g, '').slice(0, 120) || '/';
}

/** @param {string} value */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Cuerpo markdown del 404: corto y con los punteros que un agente necesita
 * para reorientarse (sitemap, llms.txt e índice de páginas).
 * @param {string} pathname
 */
export function notFoundMarkdown(pathname) {
  const requested = safePath(pathname);
  const pageList = PAGES.map(
    (page) => `- [${page.title}](${SITE_ORIGIN}${page.path}) — markdown: [${page.markdown}](${SITE_ORIGIN}${page.markdown})`
  ).join('\n');

  return `# 404 — Página no encontrada

La ruta \`${requested}\` no existe en ${SITE_ORIGIN}. Esta respuesta se envía con el estado HTTP 404: no asumas que la ruta existe.

## Dónde mirar

- [llms.txt](${SITE_ORIGIN}/llms.txt) — qué es GAO'S y cuándo usarlo
- [sitemap.xml](${SITE_ORIGIN}/sitemap.xml) — todas las URLs indexables
- [robots.txt](${SITE_ORIGIN}/robots.txt)

## Páginas disponibles

${pageList}

## Contacto

- Email: hola@gaos.es
- Formulario: ${SITE_ORIGIN}/contacto
`;
}

/**
 * Versión HTML del 404 para personas, con los mismos enlaces.
 * @param {string | null} [pathname] Ruta pedida; `null` para la versión
 *   estática (`public/404.html`), que no conoce la ruta.
 */
export function notFoundHtml(pathname) {
  const requested = pathname == null ? null : escapeHtml(safePath(pathname));
  const intro =
    requested === null
      ? '<p>Esta página no existe en gaosprojects.es.</p>'
      : `<p>La ruta <code>${requested}</code> no existe en gaosprojects.es.</p>`;
  const pageList = PAGES.map(
    (page) => `        <li><a href="${page.path}">${escapeHtml(page.title)}</a></li>`
  ).join('\n');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>404 — Página no encontrada | GAO'S</title>
    <link rel="help" type="text/plain" href="/llms.txt" />
    <style>
      html { background: #050505; color-scheme: dark; }
      body { margin: 0; background: #050505; color: #d4d4d4; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; line-height: 1.7; }
      .wrap { max-width: 46rem; margin: 0 auto; padding: 6rem 1.5rem; }
      h1 { font-family: ui-serif, Georgia, "Times New Roman", serif; font-size: clamp(2.5rem, 8vw, 4rem); color: #fff; margin: 0 0 1.5rem; letter-spacing: -0.02em; }
      h2 { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #737373; margin: 3rem 0 1rem; font-weight: 400; }
      a { color: #fff; }
      code { color: #a3a3a3; }
      ul { padding-left: 1.1rem; margin: 0; }
      li { margin-bottom: 0.5rem; }
      .home { display: inline-block; margin-top: 3rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>404</h1>
      ${intro}
      <h2>Páginas disponibles</h2>
      <ul>
${pageList}
      </ul>
      <h2>Para agentes</h2>
      <ul>
        <li><a href="/llms.txt">/llms.txt</a></li>
        <li><a href="/sitemap.xml">/sitemap.xml</a></li>
      </ul>
      <a class="home" href="/">Volver al inicio</a>
    </div>
  </body>
</html>
`;
}
