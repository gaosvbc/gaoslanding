import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isKnownPage,
  notFoundHtml,
  notFoundMarkdown,
  normalizePath,
  wantsMarkdown,
} from './_lib/agent-routes.js';

/**
 * Handler al que `vercel.json` reenvía cualquier ruta que no sea una página
 * real de la SPA ni un fichero estático. Antes esas rutas devolvían un 200 con
 * el shell de la aplicación (soft-404) y los agentes concluían que todas las
 * rutas existían.
 *
 * Devuelve siempre 404, con cuerpo markdown para clientes que no piden HTML
 * (agentes, curl) y una página HTML equivalente para navegadores.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const requestedPath = normalizePath(
    typeof req.query?.path === 'string' ? req.query.path : (req.url ?? '/')
  );

  // Red de seguridad: si una ruta real llegase aquí por un fallo de
  // configuración, la redirigimos al shell en vez de romperla con un 404.
  if (isKnownPage(requestedPath) && requestedPath !== '/api/not-found') {
    res.setHeader('Location', requestedPath);
    res.status(302).end();
    return;
  }

  const markdown = wantsMarkdown(req.headers.accept);

  res.setHeader('Vary', 'Accept, Accept-Encoding');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Link', '</llms.txt>; rel="help"; type="text/plain", </sitemap.xml>; rel="sitemap"');
  res.setHeader(
    'Content-Type',
    markdown ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8'
  );

  const body = markdown ? notFoundMarkdown(requestedPath) : notFoundHtml(requestedPath);

  res.status(404);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  res.send(body);
}
