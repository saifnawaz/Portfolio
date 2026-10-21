"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/** Inertia scrolling via Lenis. Skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      // Handles in-page #links; offset clears the 64px sticky navbar.
      anchors: { offset: -64 },
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
