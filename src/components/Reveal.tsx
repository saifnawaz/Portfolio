"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

/** Fades and slides its children up the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -64px 0px" }}
    >
      {children}
    </m.div>
  );
}
