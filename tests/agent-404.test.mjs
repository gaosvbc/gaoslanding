/**
 * `node --test tests/`
 *
 * Rutas inexistentes devolvían HTTP 200 con el shell de la SPA (soft-404), así
 * que los agentes concluían que todas las rutas existían. Estos tests cubren la
 * lógica del handler `api/not-found.ts` y la configuración de routing que lo
 * activa.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  PAGES,
  isKnownPage,
  normalizePath,
  notFoundHtml,
  notFoundMarkdown,
  safePath,
  wantsMarkdown,
} from '../api/_lib/agent-routes.js';

const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));

test('normalizePath quita query, fragmento y barra final', () => {
  assert.equal(normalizePath('/reformas'), '/reformas');
  assert.equal(normalizePath('/reformas/'), '/reformas');
  assert.equal(normalizePath('/reformas?a=1'), '/reformas');
  assert.equal(normalizePath('/reformas#seccion'), '/reformas');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath(''), '/');
  assert.equal(normalizePath('reformas'), '/reformas');
});

test('isKnownPage reconoce solo las rutas reales de la SPA', () => {
  for (const page of PAGES) {
    assert.equal(isKnownPage(page.path), true, `${page.path} debería ser conocida`);
  }
  assert.equal(isKnownPage('/reformas/'), true);
  assert.equal(isKnownPage('/esta-ruta-no-existe'), false);
  assert.equal(isKnownPage('/reformas/madrid'), false);
  assert.equal(isKnownPage('/wp-admin'), false);
});

test('wantsMarkdown respeta la preferencia del cliente', () => {
  assert.equal(wantsMarkdown('text/markdown'), true);
  assert.equal(wantsMarkdown('text/markdown, text/html;q=0.9'), true);
  assert.equal(wantsMarkdown('TEXT/MARKDOWN'), true);
  assert.equal(wantsMarkdown('*/*'), true, 'curl y la mayoría de agentes');
  assert.equal(wantsMarkdown(undefined), true);
  assert.equal(wantsMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'), false, 'navegador');
  assert.equal(wantsMarkdown('application/xhtml+xml'), false);
});

test('safePath no refleja HTML ni control characters en la respuesta', () => {
  assert.equal(safePath('/<script>alert(1)</script>').includes('<'), false);
  assert.equal(safePath('/"onload="x').includes('"'), false);
  assert.ok(safePath(`/${'a'.repeat(500)}`).length <= 120);
});

test('el cuerpo markdown del 404 apunta a sitemap, llms.txt y páginas', () => {
  const body = notFoundMarkdown('/ruta-inexistente');
  assert.match(body, /^# 404/m);
  assert.match(body, /\/ruta-inexistente/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /sitemap\.xml/);
  for (const page of PAGES) {
    assert.ok(body.includes(page.markdown), `falta ${page.markdown} en el 404 markdown`);
  }
});

test('el cuerpo HTML del 404 escapa la ruta pedida y lleva noindex', () => {
  const body = notFoundHtml('/<img src=x onerror=alert(1)>');
  assert.equal(body.includes('<img src=x'), false);
  assert.match(body, /name="robots" content="noindex"/);
  assert.match(body, /<h1>404<\/h1>/);
  assert.match(body, /\/llms\.txt/);
});

test('la variante estática del 404 no inventa una ruta', () => {
  const body = notFoundHtml(null);
  assert.match(body, /Esta página no existe/);
  assert.equal(body.includes('<code>'), false);
});

test('public/404.html está sincronizado con la plantilla compartida', () => {
  const onDisk = readFileSync(new URL('../public/404.html', import.meta.url), 'utf8');
  assert.equal(
    onDisk,
    notFoundHtml(null),
    'ejecuta `node scripts/build-static-404.mjs` para regenerarlo'
  );
});

test('vercel.json solo reescribe al shell las rutas reales', () => {
  const rewrites = vercelConfig.rewrites;
  const toShell = rewrites.filter((r) => r.destination === '/index.html');
  const shellSources = toShell.map((r) => r.source).join(' ');

  assert.ok(
    toShell.some((r) => r.source === '/'),
    'la home debe seguir sirviendo el shell'
  );
  for (const page of PAGES.filter((p) => p.path !== '/')) {
    assert.ok(
      shellSources.includes(page.path.slice(1)),
      `${page.path} debe seguir sirviendo el shell`
    );
  }

  const last = rewrites[rewrites.length - 1];
  assert.match(last.destination, /^\/api\/not-found/, 'el catch-all debe ir al handler 404');
  assert.match(last.source, /^\/:path\*$/);
  assert.equal(
    rewrites.some((r) => r.source === '/(.*)' && r.destination === '/index.html'),
    false,
    'el catch-all al shell (soft-404) no debe volver'
  );
});

test('no hay rutas de la SPA sin entrada en vercel.json ni en el sitemap', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const routePaths = [...app.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]);

  assert.deepEqual(
    [...routePaths].sort(),
    PAGES.map((p) => p.path).sort(),
    'App.tsx y PAGES deben describir las mismas rutas'
  );
  for (const path of routePaths) {
    assert.ok(sitemap.includes(`https://gaosprojects.es${path}`), `falta ${path} en sitemap.xml`);
  }
});
