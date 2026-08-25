import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setPlan } from "@/lib/premium";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    await setPlan(session.id, "free");
    return NextResponse.json({ ok: true, plan: "free" });
  } catch (e) {
    console.error("[cancel]", e);
    return NextResponse.json({ error: "Could not cancel." }, { status: 500 });
  }
}
