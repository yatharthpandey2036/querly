import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isPremium } from "@/lib/premium";
import { addFriendByEmail } from "@/lib/social";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!(await isPremium(session.id))) {
    return NextResponse.json({ error: "Friends are a Premium feature." }, { status: 402 });
  }
  try {
    const { email } = await req.json();
    const result = await addFriendByEmail(session.id, (email || "").trim());
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, name: result.name });
  } catch (e) {
    console.error("[friends]", e);
    return NextResponse.json({ error: "Could not add friend." }, { status: 500 });
  }
}
