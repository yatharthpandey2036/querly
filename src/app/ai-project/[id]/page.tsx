import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAiProject } from "@/content/ai-projects";
import AiProjectBuilder from "@/components/AiProjectBuilder";

export const dynamic = "force-dynamic";

export default async function AiProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const project = getAiProject(params.id);
  if (!project) notFound();

  return <AiProjectBuilder project={project} />;
}
