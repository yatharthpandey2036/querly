import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isPremium } from "@/lib/premium";
import { submitRaceScore, raceLeaderboard } from "@/lib/social";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isPremium(session.id))) {
    return NextResponse.json({ error: "Query Race is a Premium feature." }, { status: 402 });
  }
  try {
    const { score } = await req.json();
    await submitRaceScore(session.id, Number(score) || 0);
    const board = await raceLeaderboard(10);
    return NextResponse.json({ ok: true, board });
  } catch (e) {
    console.error("[race/submit]", e);
    return NextResponse.json({ error: "Could not save your score." }, { status: 500 });
  }
}
