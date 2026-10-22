"use client";

import { m } from "framer-motion";
import { maskUp } from "@/lib/motion";

const sizes = {
  lg: "text-[clamp(2.75rem,8vw,5rem)]",
  md: "text-[clamp(2rem,5vw,3rem)]",
};

/** "01 — About": mono number, then a heavy heading that slides up from a mask. */
export function SectionHeading({
  number,
  title,
  as: Tag = "h2",
  size = "lg",
}: {
  number: string;
  title: string;
  as?: "h1" | "h2";
  size?: keyof typeof sizes;
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
      <Tag
        className={`overflow-hidden pb-[0.12em] leading-[0.95] font-extrabold tracking-[-0.03em] ${sizes[size]}`}
      >
        <m.span className="block" variants={maskUp}>
          {title}
        </m.span>
      </Tag>
    </m.div>
  );
}
