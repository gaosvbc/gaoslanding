/**
 * Única fuente de verdad de SEO del sitio.
 *
 * De aquí salen: las etiquetas <head> que inyecta el pre-render, las que el
 * cliente mantiene al navegar dentro de la SPA, el sitemap.xml, el robots.txt
 * y los bloques JSON-LD. Si cambia algo, cambia aquí y en ningún otro sitio.
 *
 * HOST CANÓNICO: https://gaos.es — dominio DESNUDO, sin "www.".
 * Decidido por Raúl el 2026-09-11. gaosprojects.es pasa a ser un 301 hacia aquí
 * (eso se configura en el panel de Vercel, no en este repo). Los sitios hermanos
 * sí usan www. — no copiar esa convención aquí.
 */

export const SITE_ORIGIN = "https://gaos.es";

/** Datos identificativos publicados en /aviso-legal. No inventar ni ampliar. */
export const NAP = {
  legalName: "Gaos VBC",
  name: "GAO'S",
  tradeName: "Gaos Reformas",
  vatID: "B56445059",
  street: "Glorieta de Ruiz Giménez 5",
  city: "Madrid",
  country: "ES",
  email: "hola@gaos.es",
  telephone: "+34614279784",
  instagram: "https://www.instagram.com/gaosreformas/",
  tiktok: "https://www.tiktok.com/@gaosreformas",
  /** Propiedades hermanas. Estas sí canonicalizan en www. */
  sisterReformas: "https://www.gaosreforma.es",
  sisterStudio: "https://www.gaosstudio.es",
} as const;

export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** Texto del breadcrumb. Ausente en la home, que es el nivel 1. */
  breadcrumb?: string;
  ogType: "website" | "profile";
}

/**
 * El inventario de rutas sale de aquí y debe coincidir con el router
 * (src/App.tsx). scripts/check-routes.mjs falla si divergen.
 */
export const ROUTES: RouteSeo[] = [
  {
    path: "/",
    // El solapamiento de este título con gaosreforma.es está reportado en el
    // goal: es decisión de copy de Raúl, no se toca desde aquí.
    title: "Gaos Reformas | Diseño y Reformas Integrales en Madrid",
    description:
      "GAO'S une diseño de interiores y ejecución de obra: del concepto a la reforma integral llave en mano en Madrid y Majadahonda.",
    ogType: "website",
  },
  {
    path: "/reformas",
    title: "Reforma Integral en Madrid | Gaos Reformas",
    description:
      "Reformas integrales, de cocina y de baño en Madrid, con cobertura también en Majadahonda. Presupuesto sin compromiso.",
    breadcrumb: "Gaos Reformas",
    ogType: "website",
  },
  {
    path: "/studio",
    title: "Diseño de Interiores en Madrid | Gaos Studio",
    description:
      "Diseño de interiores de gama alta en Madrid: vivienda completa, cocinas y espacios de estar, del concepto a la visualización 3D.",
    breadcrumb: "Gaos Studio",
    ogType: "website",
  },
  {
    path: "/contacto",
    title: "Contacto | GAO'S",
    description:
      "Cuéntanos tu proyecto de reforma o interiorismo en Madrid. Presupuesto sin compromiso, sin cambios de interlocutor.",
    breadcrumb: "Contacto",
    ogType: "website",
  },
  {
    path: "/aviso-legal",
    title: "Aviso Legal | GAO'S",
    description:
      "Datos identificativos de Gaos VBC, condiciones de uso del portal, propiedad intelectual y legislación aplicable.",
    breadcrumb: "Aviso Legal",
    ogType: "website",
  },
  {
    path: "/politica-de-privacidad",
    title: "Política de Privacidad | GAO'S",
    description:
      "Cómo trata Gaos VBC los datos personales que recibe a través de la web: finalidad, base legal, plazos y derechos del usuario.",
    breadcrumb: "Política de Privacidad",
    ogType: "website",
  },
  {
    path: "/politica-de-cookies",
    title: "Política de Cookies | GAO'S",
    description:
      "Qué cookies utiliza esta web, para qué sirven y cómo aceptarlas, rechazarlas o cambiar tu decisión en cualquier momento.",
    breadcrumb: "Política de Cookies",
    ogType: "website",
  },
];

export const OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

/** URL absoluta y canónica de una ruta, siempre en el host canónico. */
export function canonicalUrl(path: string): string {
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

export function seoForPath(path: string): RouteSeo {
  const normalised = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  return ROUTES.find((r) => r.path === normalised) ?? ROUTES[0];
}

/**
 * Organization de la marca matriz, solo en la home.
 * sameAs apunta a los perfiles sociales reales y a las dos propiedades hermanas.
 * Prohibidos por el goal: AggregateRating, Product y Offer.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: NAP.name,
    legalName: NAP.legalName,
    alternateName: NAP.tradeName,
    url: `${SITE_ORIGIN}/`,
    logo: OG_IMAGE,
    image: OG_IMAGE,
    email: NAP.email,
    telephone: NAP.telephone,
    vatID: NAP.vatID,
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.street,
      addressLocality: NAP.city,
      addressCountry: NAP.country,
    },
    areaServed: [
      { "@type": "City", name: "Madrid" },
      { "@type": "City", name: "Majadahonda" },
    ],
    sameAs: [NAP.instagram, NAP.tiktok, NAP.sisterReformas, NAP.sisterStudio],
  };
}

/** BreadcrumbList de dos niveles: Inicio > página. Solo en rutas anidadas. */
export function breadcrumbSchema(route: RouteSeo) {
  if (!route.breadcrumb) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.breadcrumb,
        item: canonicalUrl(route.path),
      },
    ],
  };
}

/** Todos los bloques JSON-LD que corresponden a una ruta. */
export function schemasForRoute(route: RouteSeo): object[] {
  const schemas: object[] = [];
  if (route.path === "/") schemas.push(organizationSchema());
  const breadcrumb = breadcrumbSchema(route);
  if (breadcrumb) schemas.push(breadcrumb);
  return schemas;
}

/** Límites que el build hace cumplir. Ver scripts/check-seo.mjs. */
export const MAX_TITLE = 60;
export const MAX_DESCRIPTION = 160;
