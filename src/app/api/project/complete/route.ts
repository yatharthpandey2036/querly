import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { recordCompletion } from "@/lib/gamification";
import { getProject } from "@/content/projects";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const { projectId } = await req.json();
    const project = getProject(projectId);
    if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 400 });

    // XP is derived server-side from the project's missions.
    const xp = project.missions.reduce((sum, m) => sum + m.xp, 0);
    const result = await recordCompletion(session.id, project.id, xp, 3);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[project/complete]", e);
    return NextResponse.json({ error: "Could not save the project." }, { status: 500 });
  }
}
