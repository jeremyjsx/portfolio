"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reset window scroll on App Router navigations (titles were landing mid-page). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
