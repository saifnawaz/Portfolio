import type { Project } from "@/data/projects";
import { ArrowUpRight } from "./icons";

export function ProjectCard({ project }: { project: Project }) {
  const links = [
    { label: "Live", href: project.liveUrl },
    { label: "Code", href: project.repoUrl },
  ].filter((link): link is { label: string; href: string } => !!link.href);

  return (
    <article className="flex h-full flex-col border border-border bg-surface p-6 transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-fg motion-reduce:hover:translate-y-0">
      <h3 className="text-2xl font-bold tracking-[-0.03em]">{project.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{project.description}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="mono rounded-full border border-border px-2.5 py-1 text-[0.6875rem] text-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      {links.length > 0 && (
        <div className="mt-auto flex gap-6 pt-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="mono link-u inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
            >
              {link.label}
              <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
