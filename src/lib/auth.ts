import "server-only";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, userStats, parentLinks, type Role } from "@/db/schema";

export function hashPassword(pw: string): string {
  return bcrypt.hashSync(pw, 10);
}

export function verifyPassword(pw: string, hash: string): boolean {
  return bcrypt.compareSync(pw, hash);
}

export async function getUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  return rows[0];
}

export async function ensureStats(userId: string) {
  const existing = await db.select().from(userStats).where(eq(userStats.userId, userId));
  if (existing.length === 0) {
    await db.insert(userStats).values({ userId }).onConflictDoNothing();
  }
}

interface CreateUserInput {
  role: Role;
  name: string;
  email: string;
  password: string;
  age?: number;
  parentEmail?: string;
}

export async function createUser(input: CreateUserInput) {
  const email = input.email.toLowerCase();
  const isMinor = input.role === "student" && typeof input.age === "number" && input.age < 18;
  const consentStatus = isMinor ? "pending" : "not_required";

  const [user] = await db
    .insert(users)
    .values({
      role: input.role,
      name: input.name,
      email,
      passwordHash: hashPassword(input.password),
      age: input.age,
      parentEmail: input.parentEmail?.toLowerCase(),
      consentStatus,
    })
    .returning();

  if (input.role === "student") {
    await ensureStats(user.id);
  }
  return user;
}

/** Link a parent to a student by the student's email (used from both signup paths). */
export async function linkParentToStudentEmail(parentUserId: string, studentEmail: string) {
  const student = await getUserByEmail(studentEmail);
  if (!student || student.role !== "student") return false;
  await db
    .insert(parentLinks)
    .values({ parentUserId, studentUserId: student.id })
    .onConflictDoNothing();
  // A linked parent counts as consent granted.
  await db.update(users).set({ consentStatus: "granted" }).where(eq(users.id, student.id));
  return true;
}

/** If a student named a parentEmail and that parent already exists, link them now. */
export async function autoLinkStudentToParent(studentUserId: string, parentEmail?: string) {
  if (!parentEmail) return;
  const parent = await getUserByEmail(parentEmail);
  if (parent && parent.role === "parent") {
    await db
      .insert(parentLinks)
      .values({ parentUserId: parent.id, studentUserId })
      .onConflictDoNothing();
    await db.update(users).set({ consentStatus: "granted" }).where(eq(users.id, studentUserId));
  }
}
