// ===========================================
// Languages + URL helpers
// ===========================================

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export type Segment = "residential" | "commercial";
export const SEGMENTS: Segment[] = ["residential", "commercial"];

// Path segments are shared by both languages: /es/proyectos, /en/proyectos.
const SEGMENT_PATHS: Record<Segment, string> = { residential: "residencial", commercial: "comercial" };
export const RESERVED_PROJECT_SLUGS = Object.values(SEGMENT_PATHS);

const PAGE_PATHS = {
  home: "",
  projects: "proyectos/residencial",
  studio: "estudio",
  services: "servicios",
  contact: "contacto",
} as const;
export type PageId = keyof typeof PAGE_PATHS;

export const href = (lang: Lang, page: PageId) => `/${lang}${PAGE_PATHS[page] ? `/${PAGE_PATHS[page]}` : ""}`;
export const segmentHref = (lang: Lang, segment: Segment) => `/${lang}/proyectos/${SEGMENT_PATHS[segment]}`;
export const projectHref = (lang: Lang, slug: string) => `/${lang}/proyectos/${slug}`;

/** Which nav item is active for a pathname like /es/proyectos/casa-palmar. */
export function activePage(pathname: string): PageId {
  const first = pathname.split("/")[2] ?? "";
  if (first === "proyectos") return "projects";
  const match = (Object.keys(PAGE_PATHS) as PageId[]).find((id) => id !== "home" && PAGE_PATHS[id] === first);
  return match ?? "home";
}

/** Same page in another language: /es/estudio → /en/estudio */
export const switchLang = (pathname: string, lang: Lang) => pathname.replace(/^\/(es|en)(?=\/|$)/, `/${lang}`);
