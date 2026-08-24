import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProject } from "@/content/projects";
import ProjectBuilder from "@/components/ProjectBuilder";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const project = getProject(params.id);
  if (!project) notFound();

  return <ProjectBuilder project={project} userName={session.name} />;
}
