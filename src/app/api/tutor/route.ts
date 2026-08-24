import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getLesson } from "@/content/curriculum";

// Bit, the AI tutor / co-builder. Gives ONE short hint that guides — never the
// full answer. Works for both lessons (looked up by id) and capstone projects
// (which pass taskPrompt + fallbackHint directly). Falls back to curated hints
// when no ANTHROPIC_API_KEY is set, so the app works with no AI bill.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();
  const { lessonId, challengeId, userQuery, errorMsg, taskPrompt, fallbackHint } = body;

  const lesson = lessonId ? getLesson(lessonId) : undefined;
  const challenge = lesson?.challenges.find((c) => c.id === challengeId);

  const prompt: string = challenge?.prompt ?? taskPrompt ?? "a SQL task";
  const hint: string = challenge?.hint ?? fallbackHint ?? "Look at the query one keyword at a time.";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ hint, source: "curated" });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const system =
      "You are Bit, a friendly beaver who helps a teenager (grade 9-12) learn SQL and build small apps on a Duolingo-style app. " +
      "Give exactly ONE short, encouraging hint (max 2 sentences). " +
      "NEVER paste the full correct query — nudge their thinking with a question or a pointer. " +
      "Keep it warm, simple, and jargon-light.";

    const user =
      `Task: ${prompt}\n` +
      (userQuery ? `Student's attempt: ${userQuery}\n` : "") +
      (errorMsg ? `Database error: ${errorMsg}\n` : "") +
      `A known-good hint you can build on (do not repeat it verbatim): ${hint}`;

    const resp = await client.messages.create({
      model: process.env.TUTOR_MODEL || "claude-haiku-4-5",
      max_tokens: 150,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = resp.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join(" ")
      .trim();

    return NextResponse.json({ hint: text || hint, source: text ? "ai" : "curated" });
  } catch (e) {
    console.error("[tutor]", e);
    return NextResponse.json({ hint, source: "curated" });
  }
}
