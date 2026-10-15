import type { Metadata } from "next";
import { Studio } from "@/app/components/Studio";
import { getLang, getSite, pageMetadata } from "@/app/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { STUDIO_QUERY, type StudioData } from "@/sanity/lib/queries";

const getStudio = (lang: string) => sanityFetch<StudioData>(STUDIO_QUERY, { lang });

export async function generateMetadata({ params }: PageProps<"/[lang]/studio">): Promise<Metadata> {
  const lang = await getLang(params);
  const [data, { t }] = await Promise.all([getStudio(lang), getSite(lang)]);
  return pageMetadata({ lang, path: "/studio", title: t.navAbout, description: data.body?.[0]?.text, seo: data.seo, image: data.portrait });
}

export default async function StudioPage({ params }: PageProps<"/[lang]/studio">) {
  const lang = await getLang(params);
  return <Studio data={await getStudio(lang)} />;
}
