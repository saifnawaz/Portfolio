"use client";

import { m } from "framer-motion";
import { site } from "@/data/site";
import { fadeUp, letterStagger, maskUp } from "@/lib/motion";
import { Container } from "../Container";
import { Dot } from "../Dot";
import { ArrowDown } from "../icons";

// Tagline and buttons start once the letters have mostly landed.
const AFTER_NAME = 0.75;

export function Hero() {
  const lines = site.name.split(" ");

  return (
    <section>
      <Container className="flex min-h-[calc(85svh-4rem)] flex-col justify-between gap-12 pt-8 pb-12 sm:pt-12 sm:pb-16">
        <m.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="mono flex items-center justify-between gap-4 text-muted"
        >
          <span className="flex items-center gap-2">
            <Dot />
            {site.availability}
          </span>
          <span className="hidden text-right sm:inline">{site.heroNote}</span>
        </m.div>

        <m.div initial="hidden" animate="show">
          <m.h1
            variants={letterStagger}
            aria-label={site.name}
            className="text-[clamp(5rem,22vw,8.75rem)] leading-[0.85] font-extrabold tracking-[-0.03em]"
          >
            {lines.map((line) => (
              // Each line is a mask; letters slide up from behind it.
              <span
                key={line}
                aria-hidden
                className="block overflow-hidden pt-[0.04em] pb-[0.06em]"
              >
                {Array.from(line).map((char, i) => (
                  <m.span key={i} variants={maskUp} className="inline-block">
                    {char}
                  </m.span>
                ))}
              </span>
            ))}
          </m.h1>

          <div className="mt-8 flex flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
            <m.p
              variants={fadeUp}
              custom={AFTER_NAME}
              className="max-w-md text-lg leading-snug sm:text-xl"
            >
              {site.intro}
            </m.p>
            <m.div
              variants={fadeUp}
              custom={AFTER_NAME + 0.1}
              className="flex flex-wrap gap-3"
            >
              <a href="#about" className="btn btn-solid mono">
                About me
                <ArrowDown className="size-3.5" />
              </a>
              <a href="#contact" className="btn mono">
                Contact
              </a>
            </m.div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}
