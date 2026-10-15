// Shared by /projects/residential and /projects/commercial
import type { Metadata } from "next";
import { ProjectIndex } from "@/app/components/Projects";
import { accentText } from "@/app/lib/text";
import { getLang, pageMetadata } from "@/app/lib/site";
import type { Segment } from "@/app/lib/routes";
import { sanityFetch } from "@/sanity/lib/client";
import { PROJECTS_QUERY, type ProjectsData } from "@/sanity/lib/queries";

const getProjects = (lang: string) => sanityFetch<ProjectsData>(PROJECTS_QUERY, { lang });

export function segmentPage(segment: Segment, path: string) {
  async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
    const lang = await getLang(params);
    const { page } = await getProjects(lang);
    const segmentTitle = segment === "residential" ? page.residentialTitle : page.commercialTitle;
    return pageMetadata({
      lang,
      path,
      title: `${accentText(page.title)} — ${segmentTitle}`,
      description: segment === "residential" ? page.residentialIntro : page.commercialIntro,
      seo: page.seo,
    });
  }

  async function Page({ params }: PageProps<"/[lang]">) {
    const lang = await getLang(params);
    return <ProjectIndex segment={segment} data={await getProjects(lang)} />;
  }

  return { generateMetadata, Page };
}
