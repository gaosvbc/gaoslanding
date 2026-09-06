/**
 * Genera `public/404.html` a partir de la misma plantilla que usa la función
 * serverless `api/not-found.ts`, para que el 404 estático (Cloudflare Pages,
 * Netlify o cualquier host que sirva `404.html`) no se desincronice.
 *
 * Uso: node scripts/build-static-404.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { notFoundHtml } from '../api/_lib/agent-routes.js';

const outputPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', '404.html');

export const staticNotFoundHtml = notFoundHtml(null);

if (process.argv[1] && process.argv[1].endsWith('build-static-404.mjs')) {
  writeFileSync(outputPath, staticNotFoundHtml, 'utf8');
  console.log(`Escrito ${outputPath}`);
}
