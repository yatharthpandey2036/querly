import { NextResponse } from "next/server";
import { createUser, getUserByEmail, autoLinkStudentToParent, linkParentToStudentEmail } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { homePathForRole } from "@/lib/rbac";
import type { Role } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const role: Role = body.role === "parent" ? "parent" : "student";
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const age = body.age ? Number(body.age) : undefined;
    const linkEmail = (body.linkEmail || "").trim().toLowerCase() || undefined;

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: "Please enter a name, a valid email, and a password of at least 6 characters." },
        { status: 400 },
      );
    }
    if (await getUserByEmail(email)) {
      return NextResponse.json({ error: "An account with this email already exists. Try logging in." }, { status: 409 });
    }

    const user = await createUser({
      role,
      name,
      email,
      password,
      age,
      parentEmail: role === "student" ? linkEmail : undefined,
    });

    // Wire up parent <-> student links from whichever side we can.
    if (role === "student") {
      await autoLinkStudentToParent(user.id, linkEmail);
    } else if (role === "parent" && linkEmail) {
      await linkParentToStudentEmail(user.id, linkEmail);
    }

    await createSession({ id: user.id, name: user.name, role: user.role });
    return NextResponse.json({ ok: true, redirect: homePathForRole(user.role) });
  } catch (e) {
    console.error("[signup]", e);
    return NextResponse.json(
      { error: "Could not create the account. Is the database connected? Check DATABASE_URL." },
      { status: 500 },
    );
  }
}
