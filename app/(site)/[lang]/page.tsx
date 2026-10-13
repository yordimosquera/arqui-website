import type { Metadata } from "next";
import { Home } from "@/app/components/Home";
import { getLang, pageMetadata } from "@/app/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { HOME_QUERY, type HomeData } from "@/sanity/lib/queries";

const getHome = (lang: string) => sanityFetch<HomeData>(HOME_QUERY, { lang });

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const lang = await getLang(params);
  const { page } = await getHome(lang);
  return pageMetadata({ lang, path: "", description: page.heroSub, seo: page.seo, image: page.heroImage });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await getLang(params);
  return <Home data={await getHome(lang)} />;
}
