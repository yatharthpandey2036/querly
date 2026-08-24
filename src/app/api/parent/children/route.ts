import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { getSession } from "@/lib/session";
import { parentLinks, users, userStats, progress } from "@/db/schema";
import { can } from "@/lib/rbac";
import { ALL_LESSONS } from "@/content/curriculum";

// Read-only view of a parent's linked children: streak, XP, time proxy, mastered skills.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!can(session.role, "view_child_progress")) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  try {
    const links = await db
      .select()
      .from(parentLinks)
      .where(eq(parentLinks.parentUserId, session.id));
    const childIds = links.map((l) => l.studentUserId);
    if (childIds.length === 0) return NextResponse.json({ children: [] });

    const kids = await db.select().from(users).where(inArray(users.id, childIds));
    const stats = await db.select().from(userStats).where(inArray(userStats.userId, childIds));
    const done = await db.select().from(progress).where(inArray(progress.userId, childIds));

    const children = kids.map((k) => {
      const s = stats.find((x) => x.userId === k.id);
      const myLessons = done.filter((d) => d.userId === k.id);
      const mastered = ALL_LESSONS.filter((l) => myLessons.some((d) => d.lessonId === l.id)).map(
        (l) => l.title,
      );
      return {
        id: k.id,
        name: k.name,
        streak: s?.streakCount ?? 0,
        xp: s?.xp ?? 0,
        gems: s?.gems ?? 0,
        lessonsCompleted: myLessons.length,
        masteredSkills: mastered,
      };
    });

    return NextResponse.json({ children });
  } catch (e) {
    console.error("[parent/children]", e);
    return NextResponse.json({ error: "Could not load children." }, { status: 500 });
  }
}
