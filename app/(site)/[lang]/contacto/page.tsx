import type { Metadata } from "next";
import { Contact } from "@/app/components/Contact";
import { getLang, getSite, pageMetadata } from "@/app/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { CONTACT_QUERY, type ContactData } from "@/sanity/lib/queries";

const getContact = (lang: string) => sanityFetch<ContactData>(CONTACT_QUERY, { lang });

export async function generateMetadata({ params }: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const lang = await getLang(params);
  const [data, { t }] = await Promise.all([getContact(lang), getSite(lang)]);
  return pageMetadata({ lang, path: "/contacto", title: t.navContact, description: data.body, seo: data.seo });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contacto">) {
  const lang = await getLang(params);
  return <Contact data={await getContact(lang)} />;
}
