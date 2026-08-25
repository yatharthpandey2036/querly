import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { setPlan } from "@/lib/premium";

// DEMO subscription — activates premium without collecting any real payment.
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  try {
    const { plan } = await req.json();
    const chosen = plan === "family" ? "family" : "premium";
    await setPlan(session.id, chosen);
    return NextResponse.json({ ok: true, plan: chosen });
  } catch (e) {
    console.error("[subscribe]", e);
    return NextResponse.json({ error: "Could not start the plan." }, { status: 500 });
  }
}
