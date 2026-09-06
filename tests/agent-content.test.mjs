/**
 * `node --test tests/`
 *
 * Cubre las tres capas que un agente lee sin ejecutar JavaScript: el contenido
 * estático de `index.html`, los datos estructurados JSON-LD y los ficheros
 * markdown / `llms.txt`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { PAGES } from '../api/_lib/agent-routes.js';

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
const html = read('index.html');

/** Texto visible del HTML, sin markup, scripts ni estilos. */
function textContent(source) {
  return source
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('la home sirve contenido real en el HTML inicial, sin JavaScript', () => {
  const body = html.slice(html.indexOf('<body'));
  const text = textContent(body);
  assert.ok(
    text.length >= 500,
    `el HTML inicial solo trae ${text.length} caracteres de texto (mínimo 500)`
  );
  assert.match(text, /reformas integrales/i);
  assert.match(text, /Madrid/);
});

test('la home tiene un único H1 y niveles de encabezado secuenciales', () => {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  assert.equal(levels.filter((l) => l === 1).length, 1, 'debe haber exactamente un H1');
  assert.equal(levels[0], 1, 'el primer encabezado debe ser el H1');
  for (let i = 1; i < levels.length; i += 1) {
    assert.ok(
      levels[i] <= levels[i - 1] + 1,
      `salto de encabezado h${levels[i - 1]} -> h${levels[i]}`
    );
  }
});

test('el contenido estático vive dentro de #root para que React lo sustituya', () => {
  const rootIndex = html.indexOf('<div id="root">');
  const staticIndex = html.indexOf('<div id="static-content">');
  assert.ok(rootIndex !== -1 && staticIndex > rootIndex);
});

test('la home declara la variante markdown y la guía para agentes', () => {
  assert.match(html, /<link rel="alternate" type="text\/markdown" href="\/index\.md"/);
  assert.match(html, /<link rel="help" type="text\/plain" href="\/llms\.txt"/);
});

test('la home lleva JSON-LD válido con la identidad del negocio', () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1, 'un único bloque JSON-LD');

  const data = JSON.parse(blocks[0][1]);
  assert.equal(data['@context'], 'https://schema.org');

  const graph = data['@graph'];
  const business = graph.find((node) => node['@type'] === 'HomeAndConstructionBusiness');
  const website = graph.find((node) => node['@type'] === 'WebSite');

  assert.ok(business, 'falta el nodo de negocio');
  for (const field of ['name', 'description', 'url', 'telephone', 'email', 'address', 'areaServed', 'sameAs']) {
    assert.ok(business[field], `el negocio debe declarar "${field}"`);
  }
  assert.ok(Array.isArray(business.makesOffer) && business.makesOffer.length > 0);

  assert.ok(website, 'falta el nodo WebSite');
  assert.equal(website.publisher['@id'], business['@id']);
});

test('el JSON-LD ya no se duplica desde React', () => {
  const footer = read('src/components/Footer.tsx');
  assert.equal(footer.includes('application/ld+json'), false);
});

test('cada ruta tiene su variante markdown con contenido útil', () => {
  for (const page of PAGES) {
    const markdown = read(`public${page.markdown}`);
    assert.ok(markdown.length >= 500, `${page.markdown} es demasiado corto`);
    assert.match(markdown, /^# .+/m, `${page.markdown} necesita un H1`);
    assert.match(
      markdown,
      new RegExp(`https://gaosprojects\\.es${page.path === '/' ? '/' : page.path}`),
      `${page.markdown} debe declarar su URL canónica`
    );
  }
});

test('llms.txt explica cuándo usar el sitio y cómo contactar', () => {
  const llms = read('public/llms.txt');
  assert.match(llms, /^# /m, 'llms.txt empieza con un H1');
  assert.match(llms, /^> /m, 'llms.txt necesita el blockquote de resumen');
  assert.match(llms, /^## When to use this/m, 'falta la sección "when to use this"');
  assert.match(llms, /^## When not to use this/m);
  assert.match(llms, /^## How to call us/m);
  assert.match(llms, /hola@gaos\.es/);
  for (const page of PAGES) {
    assert.ok(llms.includes(`https://gaosprojects.es${page.markdown}`), `falta ${page.markdown} en llms.txt`);
  }
});

test('robots.txt publica el sitemap y apunta a llms.txt', () => {
  const robots = read('public/robots.txt');
  assert.match(robots, /Sitemap: https:\/\/gaosprojects\.es\/sitemap\.xml/);
  assert.match(robots, /llms\.txt/);
});
