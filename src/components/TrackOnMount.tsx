"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Fire a single analytics event from a server component by mounting this.
export default function TrackOnMount({ event, props }: { event: string; props?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
