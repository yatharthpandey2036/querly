import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProgressFor } from "@/lib/gamification";
import { studioAccess } from "@/lib/studio";
import TopBar from "@/components/TopBar";
import AiDj from "@/components/AiDj";
import TrackOnMount from "@/components/TrackOnMount";

export const dynamic = "force-dynamic";

export default async function AiDjPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const a = await studioAccess(session.id);
  if (!a.unlocked) redirect("/studio");

  const { stats } = await getProgressFor(session.id);

  return (
    <>
      <TopBar name={session.name} stats={{ streak: stats.streakCount, xp: stats.xp, gems: stats.gems, hearts: stats.hearts }} />
      <TrackOnMount event="Studio Project Started" props={{ projectId: "ai-dj" }} />
      <AiDj />
    </>
  );
}
