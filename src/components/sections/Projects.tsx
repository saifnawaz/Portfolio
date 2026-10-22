import { projects, upcomingNote, upcomingProjects } from "@/data/projects";
import { contact } from "@/data/site";
import { Dot } from "../Dot";
import { ProjectCard } from "../ProjectCard";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

export function Projects() {
  return (
    <Section id="projects">
      <div className="space-y-5">
        {projects.map((project) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2">
        {upcomingProjects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08}>
            <UpcomingCard {...project} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.08}>
        <p className="mt-6 max-w-xl text-muted">
          {upcomingNote.text}{" "}
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="link-u text-fg"
          >
            {upcomingNote.linkLabel}
          </a>
          .
        </p>
      </Reveal>
    </Section>
  );
}

/** Unfinished work: dashed border, no surface, muted text. */
function UpcomingCard({
  title,
  summary,
  status,
  tags,
}: (typeof upcomingProjects)[number]) {
  return (
    <article className="flex h-full flex-col border border-dashed border-fg/25 p-6 transition-colors duration-500 hover:border-fg/50">
      <span className="mono inline-flex items-center gap-2 text-fg">
        <span className="relative flex size-2" aria-hidden>
          <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
          <Dot className="relative" />
        </span>
        {status}
      </span>
      <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-fg/75">
        {title}
      </h3>
      <p className="mt-2 leading-relaxed text-muted">{summary}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="mono rounded-full border border-dashed border-border px-2.5 py-1 text-[0.6875rem] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}
