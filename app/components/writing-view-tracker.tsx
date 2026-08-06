"use client";

import { useEffect, useRef } from "react";

/** Fires one unique-daily view record. Renders nothing. */
export function WritingViewTracker({ slug }: { slug: string }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !slug) {
      return;
    }
    sent.current = true;

    void fetch(`/api/views/${encodeURIComponent(slug)}`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Tracking is best-effort.
    });
  }, [slug]);

  return null;
}
