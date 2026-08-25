"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { identify, track } from "@/lib/analytics";

export default function Analytics({ userId, name }: { userId?: string; name?: string }) {
  useEffect(() => {
    if (userId) identify(userId, name);
  }, [userId, name]);

  const path = usePathname();
  useEffect(() => {
    track("Page Viewed", { path });
  }, [path]);

  return null;
}
