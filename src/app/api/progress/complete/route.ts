import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { recordCompletion } from "@/lib/gamification";
import { getLesson } from "@/content/curriculum";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const { lessonId, stars } = await req.json();
    const lesson = getLesson(lessonId);
    if (!lesson) return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });

    // XP is derived server-side from the lesson content — never trust the client.
    const xp = lesson.challenges.reduce((sum, c) => sum + c.xp, 0);
    const result = await recordCompletion(session.id, lessonId, xp, Math.min(3, Math.max(1, Number(stars) || 1)));
    return NextResponse.json(result);
  } catch (e) {
    console.error("[complete]", e);
    return NextResponse.json({ error: "Could not save progress." }, { status: 500 });
  }
}
