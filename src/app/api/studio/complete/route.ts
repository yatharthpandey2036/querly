import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { recordCompletion } from "@/lib/gamification";
import { studioAccess } from "@/lib/studio";

const STUDIO_XP: Record<string, number> = { "ai-dj": 120 };

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // must still meet the unlock bar to save a Studio project
  const access = await studioAccess(session.id);
  if (!access.unlocked) return NextResponse.json({ error: "Studio is locked." }, { status: 402 });

  try {
    const { projectId } = await req.json();
    const xp = STUDIO_XP[projectId];
    if (!xp) return NextResponse.json({ error: "Unknown project" }, { status: 400 });
    const result = await recordCompletion(session.id, `studio-${projectId}`, xp, 3);
    return NextResponse.json(result);
  } catch (e) {
    console.error("[studio/complete]", e);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
