import { getLesson } from "@/content/tracks";

// Free tier = everything up to and INCLUDING the first capstone of each track:
//   • all Unit-1 lessons (SQL: u1*, AI: au1*)
//   • the first capstone project (SQL: p1, AI: ap1)
// Everything after that — Units 2/3, their capstones, real-life projects,
// Leagues, Friends and Query Race — requires Premium.
const FREE_LESSON_UNITS = new Set(["u1", "au1"]);
const FREE_PROJECT_IDS = new Set(["p1", "ap1"]);

export function lessonRequiresPremium(lessonId: string): boolean {
  const lesson = getLesson(lessonId);
  if (!lesson) return false;
  return !FREE_LESSON_UNITS.has(lesson.unitId);
}

// Covers both unit capstones (p2/p3/ap2/ap3) and all real-life projects (life-*).
export function projectRequiresPremium(projectId: string): boolean {
  return !FREE_PROJECT_IDS.has(projectId);
}
