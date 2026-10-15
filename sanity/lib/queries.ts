// ===========================================
// GROQ queries — every localized field is resolved for $lang (falling back to ES),
// so components receive plain strings.
// ===========================================
import type { Segment } from "@/app/lib/routes";
import type { UiStringKey } from "../schemaTypes/singletons/settings";

// ——— Projection helpers ———
const loc = (f: string) => `"${f}": coalesce(${f}[$lang], ${f}.es)`;
const locs = (...fields: string[]) => fields.map(loc).join(", ");

const PHOTO = `_key, asset, hotspot, crop, ${locs("alt", "caption")}, "lqip": asset->metadata.lqip`;
const SEO = `seo{ ${locs("title", "description")}, image }`;
const PROJECT_CARD = `_id, "slug": slug.current, category, segment, location, year, ${locs("title", "type")}, "cover": coverImage{${PHOTO}}`;
const PROJECT_ORDER = `order(year desc, title.es asc)`;
const ALL_PROJECTS = `*[_type == "project" && defined(slug.current)] | ${PROJECT_ORDER} {${PROJECT_CARD}}`;

// ——— Types ———
export type AccentSpan = { _key: string; text: string; marks?: string[] };
export type Accent = { _key: string; children: AccentSpan[] }[] | null;

export type Photo = {
  _key?: string;
  asset?: { _ref: string };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
  caption?: string | null;
  lqip?: string | null;
} | null;

export type Seo = { title?: string | null; description?: string | null; image?: Photo } | null;

export type ProjectCard = {
  _id: string;
  slug: string;
  category: "architecture" | "interiors";
  segment: Segment;
  location: string;
  year: string;
  title: string;
  type: string;
  cover: Photo;
};

export type UiStrings = Record<UiStringKey, string>;

export type SiteSettings = {
  name: string;
  initials: string;
  location?: string;
  email: string;
  phone?: string;
  instagram?: string;
  pinterest?: string;
  seo: Seo;
};

// ——— Layout ———
export const SITE_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{ name, initials, location, email, phone, instagram, pinterest, ${SEO} },
  "ui": *[_id == "uiStrings"][0]
}`;
export type SiteQueryResult = { settings: SiteSettings; ui: Record<string, { es?: string; en?: string } | string> | null };

// ——— Home ———
export const HOME_QUERY = `{
  "page": *[_id == "homePage"][0]{
    ${locs("heroEyebrow", "heroLine1", "heroLine2", "heroLine3", "heroSub", "heroStudioButton",
      "featuredEyebrow", "featuredTitle", "manifestoEyebrow", "manifestoTitle", "manifestoBody",
      "ctaEyebrow", "ctaTitle", "ctaButton")},
    "heroImage": heroImage{${PHOTO}},
    "featured": featuredProjects[]->{${PROJECT_CARD}},
    ${SEO}
  },
  "segments": *[_id == "projectsPage"][0]{ ${locs("eyebrow", "residentialTitle", "residentialIntro", "commercialTitle", "commercialIntro")} },
  "projects": ${ALL_PROJECTS}
}`;
export type SegmentsCopy = {
  eyebrow: string;
  residentialTitle: string;
  residentialIntro: string;
  commercialTitle: string;
  commercialIntro: string;
};
export type HomeData = {
  page: {
    heroEyebrow: string;
    heroLine1: string;
    heroLine2: string;
    heroLine3: string;
    heroSub: string;
    heroStudioButton: string;
    heroImage: Photo;
    featuredEyebrow: string;
    featuredTitle: Accent;
    featured: ProjectCard[] | null;
    manifestoEyebrow: string;
    manifestoTitle: Accent;
    manifestoBody: string;
    ctaEyebrow: string;
    ctaTitle: Accent;
    ctaButton: string;
    seo: Seo;
  };
  segments: SegmentsCopy;
  projects: ProjectCard[];
};

// ——— Projects index ———
export const PROJECTS_QUERY = `{
  "page": *[_id == "projectsPage"][0]{
    ${locs("eyebrow", "title", "intro", "residentialTitle", "residentialIntro", "commercialTitle", "commercialIntro")},
    ${SEO}
  },
  "projects": ${ALL_PROJECTS}
}`;
export type ProjectsData = {
  page: SegmentsCopy & { title: Accent; intro: string; seo: Seo };
  projects: ProjectCard[];
};

// ——— Project detail ———
export const PROJECT_SLUGS_QUERY = `*[_type == "project" && defined(slug.current)].slug.current`;

export const PROJECT_QUERY = `{
  "project": *[_type == "project" && slug.current == $slug][0]{
    ${PROJECT_CARD},
    ${locs("subtitle", "about", "status", "role", "team")},
    area, photos,
    "gallery": gallery[]{${PHOTO}},
    ${SEO}
  },
  "siblings": *[_type == "project" && defined(slug.current)
    && segment == *[_type == "project" && slug.current == $slug][0].segment] | ${PROJECT_ORDER} {${PROJECT_CARD}},
  "segments": *[_id == "projectsPage"][0]{ ${locs("residentialTitle", "commercialTitle")} }
}`;
export type ProjectDetailData = ProjectCard & {
  subtitle: string;
  about: string;
  status: string;
  role: string;
  team?: string | null;
  area?: string | null;
  photos?: string | null;
  gallery: NonNullable<Photo>[] | null;
  seo: Seo;
};
export type ProjectData = {
  project: ProjectDetailData | null;
  siblings: ProjectCard[];
  segments: { residentialTitle: string; commercialTitle: string };
};

// ——— Studio ———
export const STUDIO_QUERY = `*[_id == "studioPage"][0]{
  ${locs("eyebrow", "title", "portraitCredit", "timelineTitle", "quote", "quoteSource", "teamTitle", "teamIntro")},
  "portrait": portrait{${PHOTO}},
  "body": body[]{ _key, "text": coalesce(@[$lang], es) },
  "timeline": timeline[]{ _key, period, ${loc("text")} },
  "team": team[]{ _key, name, ${loc("role")}, "photo": photo{${PHOTO}} },
  ${SEO}
}`;
export type StudioData = {
  eyebrow: string;
  title: Accent;
  portrait: Photo;
  portraitCredit?: string | null;
  body: { _key: string; text: string }[] | null;
  timelineTitle: string;
  timeline: { _key: string; period: string; text: string }[] | null;
  quote?: string | null;
  quoteSource?: string | null;
  teamTitle: string;
  teamIntro: string;
  team: { _key: string; name: string; role: string; photo: Photo }[] | null;
  seo: Seo;
};

// ——— Services ———
export const SERVICES_QUERY = `*[_id == "servicesPage"][0]{
  ${locs("servicesEyebrow", "servicesTitle", "servicesIntro", "processEyebrow", "processTitle", "processIntro")},
  "services": services[]{ _key, ${locs("title", "body")} },
  "process": process[]{ _key, ${locs("title", "body", "duration")} },
  ${SEO}
}`;
export type ServicesData = {
  servicesEyebrow: string;
  servicesTitle: Accent;
  servicesIntro: string;
  services: { _key: string; title: string; body: string }[] | null;
  processEyebrow: string;
  processTitle: Accent;
  processIntro: string;
  process: { _key: string; title: string; body: string; duration: string }[] | null;
  seo: Seo;
};

// ——— Contact ———
export const CONTACT_QUERY = `*[_id == "contactPage"][0]{
  ${locs("eyebrow", "title", "body", "studioLabel", "hoursLabel", "hours", "availabilityLabel", "availabilityText", "availabilityStatus")},
  address,
  "subjects": subjects[]{ _key, ${loc("label")} },
  ${SEO}
}`;
export type ContactData = {
  eyebrow: string;
  title: Accent;
  body: string;
  subjects: { _key: string; label: string }[] | null;
  studioLabel: string;
  address?: string | null;
  hoursLabel: string;
  hours?: string | null;
  availabilityLabel: string;
  availabilityText?: string | null;
  availabilityStatus?: string | null;
  seo: Seo;
};
