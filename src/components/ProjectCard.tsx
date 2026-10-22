import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { ProjectLinks } from "./ProjectLinks";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`;
  const [cover] = project.screenshots;

  return (
    <article className="group flex h-full flex-col border border-border bg-surface transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-fg motion-reduce:hover:translate-y-0">
      {cover && (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden
          className="block overflow-hidden border-b border-border"
        >
          <Image
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 900px) 852px, 100vw"
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          <Link href={href} className="link-u">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 max-w-2xl leading-relaxed text-muted">
          {project.summary}
        </p>

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

        <div className="mt-auto pt-7">
          <ProjectLinks project={project} caseStudy />
        </div>
      </div>
    </article>
  );
}
