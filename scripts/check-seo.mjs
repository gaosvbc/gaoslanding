/**
 * Valida el HTML realmente emitido en dist/. Se ejecuta al final de `vite build`
 * (ver vite.config.ts) y rompe el build si algo incumple. También se puede
 * lanzar a mano: node scripts/check-seo.mjs
 *
 * Mide sobre los bytes del fichero, no sobre el código fuente: si el pre-render
 * deja de inyectar una etiqueta, esto se entera.
 *
 * NO mide producción. Que esto pase en verde significa que el build es
 * correcto, no que gaos.es esté sirviendo esto.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const MAX_TITLE = 60;
const MAX_DESCRIPTION = 160;
const PROHIBIDOS = ['AggregateRating', 'Product', 'Offer'];

const seoSrc = fs.readFileSync('src/seo.ts', 'utf8');
const ORIGIN = seoSrc.match(/export const SITE_ORIGIN = "([^"]+)"/)?.[1];
if (!ORIGIN) throw new Error('check-seo: no se ha podido leer SITE_ORIGIN de src/seo.ts');
const HOST = new URL(ORIGIN).host;

const app = fs.readFileSync('src/App.tsx', 'utf8');
const rutas = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);

const fallos = [];
const fail = (ruta, msg) => fallos.push(`${ruta}: ${msg}`);
let comprobaciones = 0;
const ok = () => comprobaciones++;

function fileFor(ruta) {
  return ruta === '/' ? path.join(DIST, 'index.html') : path.join(DIST, ruta.slice(1), 'index.html');
}

function textoVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const ruta of rutas) {
  const file = fileFor(ruta);
  if (!fs.existsSync(file)) {
    fail(ruta, `no se ha emitido ${file}`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const esperada = ruta === '/' ? `${ORIGIN}/` : `${ORIGIN}${ruta}`;

  if (!/<html lang="es">/.test(html)) fail(ruta, 'falta <html lang="es">'); else ok();

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(ruta, `debe haber exactamente un <h1>, hay ${h1}`); else ok();

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (!title) fail(ruta, 'falta <title>');
  else if (title.length > MAX_TITLE) fail(ruta, `title de ${title.length} caracteres (máximo ${MAX_TITLE}): ${title}`);
  else ok();

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) fail(ruta, 'falta <meta name="description">');
  else if (desc.length > MAX_DESCRIPTION) fail(ruta, `description de ${desc.length} caracteres (máximo ${MAX_DESCRIPTION})`);
  else ok();

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (canonical !== esperada) fail(ruta, `canonical es "${canonical}" y debería ser "${esperada}"`); else ok();

  for (const [prop, esperado] of [
    ['og:title', title],
    ['og:description', desc],
    ['og:url', esperada],
    ['og:image', `${ORIGIN}/og-image.jpg`],
  ]) {
    const valor = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`))?.[1];
    if (valor === undefined) fail(ruta, `falta ${prop}`);
    else if (esperado && valor.replace(/&#39;|&quot;|&amp;/g, (m) => ({ '&#39;': "'", '&quot;': '"', '&amp;': '&' })[m]) !== esperado) {
      fail(ruta, `${prop} es "${valor}" y debería ser "${esperado}"`);
    } else ok();
  }
  if (!/<meta property="og:type" content="[^"]+"/.test(html)) fail(ruta, 'falta og:type'); else ok();

  // JSON-LD: sobre el HTML crudo, que es donde lo lee un rastreador.
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (bloques.length === 0) fail(ruta, 'ningún bloque application/ld+json en el HTML crudo');
  for (const bloque of bloques) {
    let json;
    try {
      json = JSON.parse(bloque);
    } catch (e) {
      fail(ruta, `JSON-LD no parsea: ${e.message}`);
      continue;
    }
    const texto = JSON.stringify(json);
    for (const tipo of PROHIBIDOS) {
      if (new RegExp(`"@type"\\s*:\\s*"${tipo}"`).test(texto)) fail(ruta, `tipo prohibido ${tipo} en el JSON-LD`);
    }
    ok();
  }
  if (ruta === '/' && !bloques.some((b) => /"@type":\s*"Organization"/.test(b))) {
    fail(ruta, 'la home debe llevar Organization');
  } else if (ruta === '/') ok();
  if (ruta !== '/' && !bloques.some((b) => /"@type":\s*"BreadcrumbList"/.test(b))) {
    fail(ruta, 'las rutas anidadas deben llevar BreadcrumbList');
  } else if (ruta !== '/') ok();

  // Que el pre-render ha corrido se demuestra con el tamaño del #root ya
  // renderizado. El mínimo de texto visible se exige aparte y por ruta: las
  // páginas de contenido tienen que superar los 800 caracteres del criterio de
  // aceptación; /contacto es un formulario y su texto real son las etiquetas de
  // los campos. Inflarlo con copy inventado para pasar un umbral sería mentir,
  // así que el umbral se ajusta a lo que la página es.
  const root = html.match(/<div id="root">([\s\S]*)<\/div>/)?.[1] ?? '';
  if (root.trim().length < 1000) fail(ruta, `el #root emitido solo tiene ${root.trim().length} bytes: el pre-render no ha inyectado el cuerpo`); else ok();

  const minTexto = ['/', '/reformas', '/studio'].includes(ruta) ? 800 : 150;
  const texto = textoVisible(html).length;
  if (texto < minTexto) fail(ruta, `${texto} caracteres de texto visible, mínimo ${minTexto}`); else ok();
}

// --- Ficheros del sitio ---
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) fail('sitemap.xml', 'no se ha generado');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const ajenos = locs.filter((l) => new URL(l).host !== HOST);
  if (ajenos.length) fail('sitemap.xml', `${ajenos.length} <loc> en otro host: ${ajenos.join(', ')}`); else ok();
  if (locs.length !== rutas.length) fail('sitemap.xml', `${locs.length} URLs y el router tiene ${rutas.length}`); else ok();
  if (/changefreq|priority/.test(sitemap)) fail('sitemap.xml', 'lleva changefreq o priority (Google los ignora; fuera)'); else ok();
  for (const ruta of rutas) {
    const esperada = ruta === '/' ? `${ORIGIN}/` : `${ORIGIN}${ruta}`;
    if (!locs.includes(esperada)) fail('sitemap.xml', `falta ${esperada}`);
  }
}

const robotsPath = path.join(DIST, 'robots.txt');
if (!fs.existsSync(robotsPath)) fail('robots.txt', 'no se ha generado');
else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', `no declara Sitemap: ${ORIGIN}/sitemap.xml`); else ok();
  if (/Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'hay un Disallow: / que bloquearía todo'); else ok();
}

const llmsPath = path.join(DIST, 'llms.txt');
if (!fs.existsSync(llmsPath)) fail('llms.txt', 'no existe');
else if (/^\s*<!doctype/i.test(fs.readFileSync(llmsPath, 'utf8'))) fail('llms.txt', 'está sirviendo el shell de la SPA'); else ok();

if (!fs.existsSync(path.join(DIST, '404.html'))) fail('404.html', 'no existe'); else ok();

// --- Ningún rastro del host secundario en lo que se publica ---
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}
// llms.txt queda fuera a propósito: ahí se nombra gaosprojects.es para decirle
// al agente que es el mismo sitio y que cite la URL de gaos.es. En cualquier
// otro fichero publicado, una mención al host secundario es un canonical, un
// <loc> o un og:url que se ha quedado sin migrar.
const publicables = walk(DIST).filter(
  (f) => /\.(html|txt|xml|json|js|css)$/.test(f) && path.basename(f) !== 'llms.txt'
);
for (const f of publicables) {
  if (fs.readFileSync(f, 'utf8').includes('gaosprojects.es')) fail(path.relative(DIST, f), 'todavía menciona gaosprojects.es');
}
ok();

if (fallos.length) {
  console.error(`check-seo: ${fallos.length} FALLO(S)\n`);
  for (const f of fallos) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`check-seo: OK — ${comprobaciones} comprobaciones sobre ${rutas.length} rutas en dist/ (producción NO MEDIDA)`);
