"use client";

import { m } from "framer-motion";
import { maskUp } from "@/lib/motion";

/** "01 — About": mono number, then a heavy heading that slides up from a mask. */
export function SectionHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <m.div
      className="flex items-baseline gap-4 sm:gap-6"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -64px 0px" }}
    >
      <span className="mono shrink-0 text-fg">{number} —</span>
      {/* Bottom padding keeps descenders (the j in Projects) inside the mask */}
      <h2 className="overflow-hidden pb-[0.12em] text-[clamp(2.75rem,8vw,5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">
        <m.span className="block" variants={maskUp}>
          {title}
        </m.span>
      </h2>
    </m.div>
  );
}
