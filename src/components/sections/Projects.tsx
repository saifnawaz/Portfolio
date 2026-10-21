import { projects, projectsEmptyState } from "@/data/projects";
import { contact } from "@/data/site";
import { Dot } from "../Dot";
import { ArrowUpRight } from "../icons";
import { ProjectCard } from "../ProjectCard";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

export function Projects() {
  return (
    <Section id="projects">
      {projects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </Section>
  );
}

function EmptyState() {
  const { label, title, text, linkLabel } = projectsEmptyState;

  return (
    <Reveal className="flex flex-col gap-6 border border-dashed border-fg/30 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <span className="mono inline-flex items-center gap-2 text-fg">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inset-0 rounded-full bg-accent motion-safe:animate-ping" />
            <Dot className="relative" />
          </span>
          {label}
        </span>
        <p className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
          {title}
        </p>
        <p className="mt-1 max-w-md text-muted">{text}</p>
      </div>
      <a
        href={contact.github}
        target="_blank"
        rel="noreferrer"
        className="btn mono shrink-0 self-start sm:self-auto"
      >
        {linkLabel}
        <ArrowUpRight className="size-3.5" />
      </a>
    </Reveal>
  );
}
