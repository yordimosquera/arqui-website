import { redirect } from "next/navigation";
import { getLang } from "@/app/lib/site";
import { segmentHref } from "@/app/lib/routes";

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  redirect(segmentHref(await getLang(params), "residential"));
}
