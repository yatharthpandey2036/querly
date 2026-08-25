import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getLesson, nextLessonId, trackOfLesson } from "@/content/tracks";
import { lessonRequiresPremium } from "@/lib/access";
import { isPremium } from "@/lib/premium";
import LessonPlayer from "@/components/LessonPlayer";
import Paywall from "@/components/Paywall";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const lesson = getLesson(params.id);
  if (!lesson) notFound();

  if (lessonRequiresPremium(params.id) && !(await isPremium(session.id))) {
    return (
      <main className="wrap">
        <Paywall feature="This lesson" />
      </main>
    );
  }

  return (
    <LessonPlayer
      lesson={lesson}
      nextId={nextLessonId(lesson.id)}
      userName={session.name}
      track={trackOfLesson(lesson.id)}
    />
  );
}
