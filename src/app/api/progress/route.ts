import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const data = await getProgressFor(session.id);
    return NextResponse.json(data);
  } catch (e) {
    console.error("[progress]", e);
    return NextResponse.json({ error: "Could not load progress." }, { status: 500 });
  }
}
