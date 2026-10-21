import { education } from "@/data/education";
import { Dot } from "../Dot";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

export function Education() {
  return (
    <Section id="education">
      <div className="relative">
        {/* Timeline rail, centered under the 11px dots */}
        <span
          className="absolute top-2 bottom-2 left-[5px] w-px bg-border"
          aria-hidden
        />
        <ol className="space-y-9">
          {education.map((item, i) => (
            <li key={item.title} className="relative pl-9">
              <span
                className={`absolute top-[5px] left-0 size-[11px] rounded-full border-2 ${
                  item.current
                    ? "border-on-accent bg-accent"
                    : "border-fg bg-bg"
                }`}
                aria-hidden
              />
              <Reveal delay={i * 0.08}>
                <p
                  className={`mono flex items-center gap-2 ${item.current ? "text-fg" : "text-muted"}`}
                >
                  {item.current && <Dot />}
                  {item.status}
                </p>
                <h3 className="mt-2 text-2xl leading-tight font-bold tracking-[-0.03em] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-muted">{item.institution}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
