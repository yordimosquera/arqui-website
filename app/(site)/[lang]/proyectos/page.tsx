import { redirect } from "next/navigation";
import { getLang } from "@/app/lib/site";
import { segmentHref } from "@/app/lib/routes";

export default async function ProjectsPage({ params }: PageProps<"/[lang]/proyectos">) {
  redirect(segmentHref(await getLang(params), "residential"));
}
