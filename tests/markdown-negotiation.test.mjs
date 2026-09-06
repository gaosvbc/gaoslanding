/**
 * `node --test tests/`
 *
 * Negociación de contenido markdown (acceptmarkdown.com): una petición con
 * `Accept: text/markdown` debe acabar en un recurso `text/markdown`, y las
 * respuestas negociadas deben declarar `Vary: Accept` para que una CDN no sirva
 * la variante HTML cacheada a un agente que pide markdown (o al revés).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

import { PAGES } from '../api/_lib/agent-routes.js';

const vercelConfig = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const cloudflareHeaders = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
const cloudflareRedirects = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8');

const acceptMarkdown = 'text/markdown, text/html;q=0.5';

/** Reproduce el matching de `has` de Vercel sobre la cabecera Accept. */
function matchesHas(rule, accept) {
  if (!rule.has) return true;
  return rule.has.every((condition) => {
    if (condition.type !== 'header' || condition.key !== 'accept') return false;
    return new RegExp(`^${condition.value}$`).test(accept);
  });
}

/** Reproduce el matching de `source` de Vercel para los patrones que usamos. */
function matchesSource(source, pathname) {
  const pattern = source.replace(
    /\/:(\w+)\(([^)]+)\)/g,
    (_match, _name, alternatives) => `/(?:${alternatives})`
  );
  return new RegExp(`^${pattern}$`).test(pathname);
}

test('cada página tiene un fichero markdown servido estáticamente', () => {
  for (const page of PAGES) {
    assert.ok(
      existsSync(new URL(`../public${page.markdown}`, import.meta.url)),
      `falta public${page.markdown}`
    );
  }
});

test('Accept: text/markdown lleva a la variante markdown de cada página', () => {
  for (const page of PAGES) {
    const rule = vercelConfig.redirects.find(
      (r) => matchesSource(r.source, page.path) && matchesHas(r, acceptMarkdown)
    );
    assert.ok(rule, `${page.path} no negocia markdown`);
    const destination = rule.destination.replace(/:page/, page.path.slice(1));
    assert.equal(destination, page.markdown);
    assert.equal(rule.permanent, false, 'la negociación no debe cachearse como permanente');
  }
});

test('un navegador no acaba nunca en la variante markdown', () => {
  const browserAccept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
  for (const page of PAGES) {
    const rule = vercelConfig.redirects.find(
      (r) => matchesSource(r.source, page.path) && matchesHas(r, browserAccept)
    );
    assert.equal(rule, undefined, `${page.path} redirige a markdown a un navegador`);
  }
});

test('las páginas negociadas declaran Vary: Accept', () => {
  for (const page of PAGES) {
    const rule = vercelConfig.headers.find((h) => h.source === page.path);
    assert.ok(rule, `${page.path} no tiene cabeceras propias`);
    const vary = rule.headers.find((h) => h.key === 'Vary');
    assert.ok(vary, `${page.path} no declara Vary`);
    assert.match(vary.value, /\bAccept\b/);
    assert.match(vary.value, /\bAccept-Encoding\b/);

    const link = rule.headers.find((h) => h.key === 'Link');
    assert.ok(link && link.value.includes(`<${page.markdown}>`), `${page.path} no anuncia su variante markdown`);
  }
});

test('los ficheros markdown se sirven como text/markdown y con Vary', () => {
  const rule = vercelConfig.headers.find((h) => h.source === '/(.*).md');
  assert.ok(rule, 'faltan cabeceras para los ficheros .md');
  const contentType = rule.headers.find((h) => h.key === 'Content-Type');
  const vary = rule.headers.find((h) => h.key === 'Vary');
  assert.match(contentType.value, /^text\/markdown; charset=utf-8$/);
  assert.match(vary.value, /\bAccept\b/);
});

test('_headers y _redirects mantienen la paridad con vercel.json', () => {
  for (const page of PAGES) {
    assert.ok(cloudflareHeaders.includes(`<${page.markdown}>`), `_headers no anuncia ${page.markdown}`);
    assert.match(
      cloudflareRedirects,
      new RegExp(`^${page.path === '/' ? '/' : page.path}\\s+/index\\.html\\s+200$`, 'm'),
      `_redirects no sirve el shell en ${page.path}`
    );
  }
  assert.match(cloudflareRedirects, /^\/\*\s+\/404\.html\s+404$/m, '_redirects no devuelve 404 real');
  assert.equal(
    /^\/\*\s+\/index\.html\s+200$/m.test(cloudflareRedirects),
    false,
    'el catch-all 200 (soft-404) no debe volver'
  );
});
