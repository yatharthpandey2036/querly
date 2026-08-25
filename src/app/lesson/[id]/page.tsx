import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getLesson, nextLessonId, trackOfLesson } from "@/content/tracks";
import LessonPlayer from "@/components/LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const lesson = getLesson(params.id);
  if (!lesson) notFound();

  return (
    <LessonPlayer
      lesson={lesson}
      nextId={nextLessonId(lesson.id)}
      userName={session.name}
      track={trackOfLesson(lesson.id)}
    />
  );
}
