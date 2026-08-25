import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAiProject } from "@/content/ai-projects";
import { projectRequiresPremium } from "@/lib/access";
import { isPremium } from "@/lib/premium";
import AiProjectBuilder from "@/components/AiProjectBuilder";
import Paywall from "@/components/Paywall";

export const dynamic = "force-dynamic";

export default async function AiProjectPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const project = getAiProject(params.id);
  if (!project) notFound();

  if (projectRequiresPremium(params.id) && !(await isPremium(session.id))) {
    return (
      <main className="wrap">
        <Paywall feature={project.kind === "life" ? "Real-life projects" : "This project"} />
      </main>
    );
  }

  return <AiProjectBuilder project={project} />;
}
