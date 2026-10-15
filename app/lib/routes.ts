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

// Segment pages live at /projects/<segment>, so no project can use these slugs.
export const RESERVED_PROJECT_SLUGS: string[] = SEGMENTS;

// Path segments are in English for both languages: /es/studio, /en/studio.
const PAGE_PATHS = {
  home: "",
  projects: "projects/residential",
  studio: "studio",
  services: "services",
  contact: "contact",
} as const;
export type PageId = keyof typeof PAGE_PATHS;

export const href = (lang: Lang, page: PageId) => `/${lang}${PAGE_PATHS[page] ? `/${PAGE_PATHS[page]}` : ""}`;
export const segmentHref = (lang: Lang, segment: Segment) => `/${lang}/projects/${segment}`;
export const projectHref = (lang: Lang, slug: string) => `/${lang}/projects/${slug}`;

/** Which nav item is active for a pathname like /es/projects/casa-palmar. */
export function activePage(pathname: string): PageId {
  const first = pathname.split("/")[2] ?? "";
  if (first === "projects") return "projects";
  const match = (Object.keys(PAGE_PATHS) as PageId[]).find((id) => id !== "home" && PAGE_PATHS[id] === first);
  return match ?? "home";
}

/** Same page in another language: /es/studio → /en/studio */
export const switchLang = (pathname: string, lang: Lang) => pathname.replace(/^\/(es|en)(?=\/|$)/, `/${lang}`);
