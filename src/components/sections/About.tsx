import { site } from "@/data/site";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <p className="text-2xl leading-[1.2] font-bold tracking-[-0.02em] sm:text-[2rem]">
          {site.aboutLead}
        </p>
      </Reveal>
      <dl className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-6">
        {site.aboutFacts.map((fact, i) => (
          <Reveal
            key={fact.label}
            delay={0.1 + i * 0.12}
            className="border-t border-fg pt-4"
          >
            <dt className="mono text-muted">{fact.label}</dt>
            <dd className="mt-2 text-base leading-relaxed sm:text-[17px]">
              {fact.text}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
