import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { canonicalUrl, OG_IMAGE, seoForPath } from "../seo";

/**
 * Mantiene el <head> sincronizado con la ruta MIENTRAS se navega dentro de la
 * SPA. El <head> de la primera carga no lo pone esto: lo escribe el pre-render
 * en el HTML estático de cada ruta (ver vite.config.ts). Este componente solo
 * evita que el título y el canonical se queden congelados al cambiar de página
 * sin recargar.
 *
 * Sustituye a los useEffect que ReformasLanding y StudioLanding tenían cada uno
 * por su cuenta: los textos viven ahora en src/seo.ts, en un único sitio.
 */
function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const route = seoForPath(pathname);
    const url = canonicalUrl(route.path);

    document.title = route.title;
    setMeta('meta[name="description"]', "name", "description", route.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    setMeta('meta[property="og:title"]', "property", "og:title", route.title);
    setMeta('meta[property="og:description"]', "property", "og:description", route.description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", OG_IMAGE);
    setMeta('meta[property="og:type"]', "property", "og:type", route.ogType);
  }, [pathname]);

  return null;
}
