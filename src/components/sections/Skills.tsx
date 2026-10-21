"use client";

import { m } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { ease } from "@/lib/motion";
import { Dot } from "../Dot";
import { Marquee } from "../Marquee";
import { Section } from "../Section";

export function Skills() {
  return (
    <Section id="skills">
      <div className="divide-y divide-border border-y border-border">
        {skillGroups.map((group, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <m.div
              key={group.title}
              initial={{ opacity: 0, x: fromLeft ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -48px 0px" }}
              transition={{ duration: 0.9, ease, delay: i * 0.08 }}
              className="grid gap-3 py-5 sm:grid-cols-[10.5rem_1fr] sm:items-center sm:gap-6 sm:py-6"
            >
              <h3 className="mono flex items-center gap-2 text-muted">
                {group.current && <Dot />}
                {group.title}
              </h3>
              <Marquee
                items={group.skills}
                reverse={!fromLeft}
                highlight={group.current}
              />
            </m.div>
          );
        })}
      </div>
    </Section>
  );
}
