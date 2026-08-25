// Track registry — students choose SQL or AI. Lookups work across both tracks
// (lesson ids are unique per track: SQL "u1l1", AI "au1l1").
import { CURRICULUM, type Unit, type Lesson } from "./curriculum";
import { AI_CURRICULUM } from "./ai-curriculum";

export type TrackId = "sql" | "ai";

export interface Track {
  id: TrackId;
  name: string;
  short: string;
  icon: string;
  blurb: string;
  curriculum: Unit[];
}

export const TRACKS: Track[] = [
  { id: "sql", name: "SQL & Databases", short: "SQL", icon: "🗄️", blurb: "Ask real data questions.", curriculum: CURRICULUM },
  { id: "ai", name: "Artificial Intelligence", short: "AI", icon: "🤖", blurb: "How AI learns and thinks.", curriculum: AI_CURRICULUM },
];

export function getTrack(id: string | undefined): Track {
  return TRACKS.find((t) => t.id === id) ?? TRACKS[0];
}

export function curriculumFor(id: string | undefined): Unit[] {
  return getTrack(id).curriculum;
}

export const ALL_UNITS: Unit[] = TRACKS.flatMap((t) => t.curriculum);
export const ALL_LESSONS: Lesson[] = ALL_UNITS.flatMap((u) => u.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}
export function getUnit(id: string): Unit | undefined {
  return ALL_UNITS.find((u) => u.id === id);
}

export function trackOfLesson(id: string): TrackId {
  for (const t of TRACKS) {
    if (t.curriculum.some((u) => u.lessons.some((l) => l.id === id))) return t.id;
  }
  return "sql";
}
export function trackOfUnit(unitId: string): TrackId {
  for (const t of TRACKS) {
    if (t.curriculum.some((u) => u.id === unitId)) return t.id;
  }
  return "sql";
}

/** Next lesson within the same track. */
export function nextLessonId(id: string): string | null {
  const track = getTrack(trackOfLesson(id));
  const order = track.curriculum.flatMap((u) => u.lessons.map((l) => l.id));
  const i = order.indexOf(id);
  return i === -1 || i === order.length - 1 ? null : order[i + 1];
}
