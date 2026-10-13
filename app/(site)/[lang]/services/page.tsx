import type { Metadata } from "next";
import { ServicesPage } from "@/app/components/Studio";
import { getLang, getSite, pageMetadata } from "@/app/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { SERVICES_QUERY, type ServicesData } from "@/sanity/lib/queries";

const getServices = (lang: string) => sanityFetch<ServicesData>(SERVICES_QUERY, { lang });

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const lang = await getLang(params);
  const [data, { t }] = await Promise.all([getServices(lang), getSite(lang)]);
  return pageMetadata({ lang, path: "/services", title: t.navServices, description: data.servicesIntro, seo: data.seo });
}

export default async function Services({ params }: PageProps<"/[lang]/services">) {
  const lang = await getLang(params);
  return <ServicesPage data={await getServices(lang)} />;
}
