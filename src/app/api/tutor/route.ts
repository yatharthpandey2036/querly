import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getLesson } from "@/content/curriculum";

// Bit, the AI tutor. Gives ONE short hint that guides — never the full answer.
// If ANTHROPIC_API_KEY is set it uses a real LLM; otherwise it falls back to the
// hand-written hint attached to the challenge, so the app works with no AI bill.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { lessonId, challengeId, userQuery, errorMsg } = await req.json();
  const lesson = getLesson(lessonId);
  const challenge = lesson?.challenges.find((c) => c.id === challengeId);
  const fallbackHint = challenge?.hint ?? "Take another look at the shape of the query, one keyword at a time.";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !challenge) {
    return NextResponse.json({ hint: fallbackHint, source: "curated" });
  }

  try {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const system =
      "You are Bit, a friendly beaver tutor helping a teenager (grade 9-12) learn SQL on a Duolingo-style app. " +
      "Give exactly ONE short, encouraging hint (max 2 sentences). " +
      "NEVER reveal the full correct query or paste the answer — nudge their thinking with a question or a pointer. " +
      "Keep it warm, simple, and jargon-light.";

    const user =
      `Task: ${challenge.prompt}\n` +
      (userQuery ? `Student's attempt: ${userQuery}\n` : "") +
      (errorMsg ? `Database error: ${errorMsg}\n` : "") +
      `A known-good hint you can build on (do not just repeat it verbatim): ${challenge.hint}`;

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

    return NextResponse.json({ hint: text || fallbackHint, source: text ? "ai" : "curated" });
  } catch (e) {
    console.error("[tutor]", e);
    // Any failure (bad key, rate limit, network) degrades gracefully to the curated hint.
    return NextResponse.json({ hint: fallbackHint, source: "curated" });
  }
}
