// ===========================================
// Server-side helpers shared by the [lang] layout and pages
// ===========================================
import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_QUERY, type Photo, type Seo, type SiteQueryResult, type UiStrings } from "@/sanity/lib/queries";
import { isLang, LANGS, type Lang } from "./routes";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Validates the [lang] param; unknown languages are a 404. */
export async function getLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return lang;
}

/** Studio settings + interface strings resolved for `lang` (falls back to ES). */
export const getSite = cache(async (lang: Lang) => {
  const { settings, ui } = await sanityFetch<SiteQueryResult>(SITE_QUERY, { lang });
  const t = Object.fromEntries(
    Object.entries(ui ?? {})
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, value]) => [key, typeof value === "object" && value ? value[lang] || value.es || "" : ""]),
  ) as UiStrings;
  return { settings, t };
});

const ogImage = (image: Photo | undefined) =>
  image?.asset ? [{ url: urlFor(image).width(1200).height(630).fit("crop").url(), width: 1200, height: 630 }] : undefined;

/**
 * Page metadata: Sanity SEO fields win, then the page's own title/description,
 * then the global defaults. `path` is the route without the language prefix.
 */
export async function pageMetadata({
  lang,
  path,
  title,
  description,
  seo,
  image,
}: {
  lang: Lang;
  path: string;
  title?: string;
  description?: string | null;
  seo?: Seo;
  image?: Photo;
}): Promise<Metadata> {
  const { settings } = await getSite(lang);
  const resolvedTitle = seo?.title || title;
  const resolvedDescription = seo?.description || description || settings.seo?.description || undefined;
  return {
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    description: resolvedDescription,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `/${l}${path}`])),
    },
    openGraph: {
      siteName: settings.name,
      locale: lang === "es" ? "es_CO" : "en_US",
      ...(resolvedTitle ? { title: resolvedTitle } : {}),
      description: resolvedDescription,
      images: ogImage(seo?.image) ?? ogImage(image) ?? ogImage(settings.seo?.image),
    },
  };
}
