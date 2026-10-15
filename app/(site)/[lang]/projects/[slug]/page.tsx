import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/app/components/Detail";
import { getLang, pageMetadata } from "@/app/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { PROJECT_QUERY, PROJECT_SLUGS_QUERY, type ProjectData } from "@/sanity/lib/queries";

type Params = PageProps<"/[lang]/projects/[slug]">["params"];

// Projects published after the build are rendered on first visit (dynamicParams defaults to true).
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(PROJECT_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

async function getProject(params: Params) {
  const lang = await getLang(params);
  const { slug } = await params;
  const data = await sanityFetch<ProjectData>(PROJECT_QUERY, { lang, slug });
  if (!data.project) notFound();
  return { lang, slug, data: { ...data, project: data.project } };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug, data } = await getProject(params);
  const { project } = data;
  return pageMetadata({
    lang,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.subtitle,
    seo: project.seo,
    image: project.cover,
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { data } = await getProject(params);
  return <ProjectDetail data={data} />;
}
