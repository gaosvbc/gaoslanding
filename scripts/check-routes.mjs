/**
 * Comprueba que la lista de rutas está sincronizada en los tres sitios donde vive:
 *   1. el router de la aplicación (src/App.tsx)  <- única fuente de verdad
 *   2. los rewrites de vercel.json
 *   3. public/_redirects
 *
 * Si alguna ruta del router no está en vercel.json, esa ruta devolverá 404 en
 * producción. Si sobra una en vercel.json, esa ruta será un soft 404.
 *
 * Uso: node scripts/check-routes.mjs   (sale con código 1 si hay divergencia)
 *
 * NOTA: sitemap.xml y robots.txt todavía apuntan al host equivocado y se
 * regenerarán cuando Raúl confirme el host canónico; por eso no se validan aquí.
 */
import fs from 'node:fs';

const app = fs.readFileSync('src/App.tsx', 'utf8');
const routerRoutes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
if (routerRoutes.length === 0) {
  console.error('check-routes: no se ha encontrado ninguna <Route> en src/App.tsx');
  process.exit(1);
}

// "/" lo sirve dist/index.html desde el sistema de ficheros: no necesita rewrite.
const esperadas = routerRoutes.filter((r) => r !== '/').sort();

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const enVercel = (vercel.rewrites ?? []).map((r) => r.source).sort();

const redirects = fs.readFileSync('public/_redirects', 'utf8');
const enRedirects = redirects
  .split('\n')
  .filter((l) => l.trim() && !l.trim().startsWith('#'))
  .map((l) => l.trim().split(/\s+/))
  .filter(([from, to]) => to === '/index.html')
  .map(([from]) => from)
  .sort();

let fallos = 0;
function comparar(nombre, actual) {
  const faltan = esperadas.filter((r) => !actual.includes(r));
  const sobran = actual.filter((r) => !esperadas.includes(r));
  if (faltan.length || sobran.length) {
    fallos++;
    console.error(`FALLO ${nombre}:`);
    if (faltan.length) console.error(`  faltan: ${faltan.join(', ')}`);
    if (sobran.length) console.error(`  sobran: ${sobran.join(', ')}`);
  } else {
    console.log(`OK ${nombre}: ${actual.length} rutas sincronizadas con el router`);
  }
}

console.log(`router (src/App.tsx): ${routerRoutes.join(' ')}`);
comparar('vercel.json', enVercel);
comparar('public/_redirects', enRedirects);

if (!fs.existsSync('public/404.html')) {
  fallos++;
  console.error('FALLO: falta public/404.html (sin él las rutas desconocidas no dan 404)');
} else {
  console.log('OK public/404.html presente');
}

process.exit(fallos === 0 ? 0 : 1);
