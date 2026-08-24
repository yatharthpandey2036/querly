import { NextResponse } from "next/server";
import { getUserByEmail, verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { homePathForRole } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await getUserByEmail((email || "").trim().toLowerCase());
    if (!user || !verifyPassword(password || "", user.passwordHash)) {
      return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
    }
    await createSession({ id: user.id, name: user.name, role: user.role });
    return NextResponse.json({ ok: true, redirect: homePathForRole(user.role) });
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ error: "Login failed. Check the database connection." }, { status: 500 });
  }
}
