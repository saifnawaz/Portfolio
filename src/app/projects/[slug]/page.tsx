import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ArrowLeft } from "@/components/icons";
import { ProjectLinks } from "@/components/ProjectLinks";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.summary,
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const sections = project.caseStudy.length;

  return (
    <main>
      <Container>
        <header className="pt-8 pb-13 sm:pt-12 sm:pb-18">
          <Reveal>
            {/* Plain <a> so Lenis smooth-scrolls to the section */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#projects"
              className="mono link-u inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
            >
              <ArrowLeft className="size-3.5" />
              All projects
            </a>
          </Reveal>
          <div className="mt-10 sm:mt-14">
            <SectionHeading number="Case study" title={project.title} as="h1" />
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-snug sm:text-xl">
              {project.summary}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="mono rounded-full border border-border px-2.5 py-1 text-[0.6875rem] text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="mt-8 empty:hidden">
              <ProjectLinks project={project} />
            </div>
          </Reveal>
        </header>

        {project.caseStudy.map((section, i) => (
          <section key={section.title} className="border-t border-border py-13 sm:py-16">
            <SectionHeading
              number={String(i + 1).padStart(2, "0")}
              title={section.title}
              size="md"
            />
            <Reveal className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted sm:mt-8">
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.list && (
                <ul className="space-y-3">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-fg" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
            {section.stats && (
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {section.stats.map((stat, j) => (
                  <Reveal
                    key={stat.label}
                    delay={j * 0.08}
                    className="flex flex-col-reverse border border-border bg-surface p-6"
                  >
                    <dt className="mono mt-3 text-muted">{stat.label}</dt>
                    <dd className="text-[clamp(2.75rem,8vw,4rem)] leading-none font-extrabold tracking-[-0.03em]">
                      {stat.value}
                    </dd>
                  </Reveal>
                ))}
              </dl>
            )}
          </section>
        ))}

        {project.screenshots.length > 0 && (
          <section className="border-t border-border py-13 sm:py-16">
            <SectionHeading
              number={String(sections + 1).padStart(2, "0")}
              title="Screenshots"
              size="md"
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {project.screenshots.map((shot, i) => (
                <Reveal
                  key={shot.src}
                  delay={(i % 2) * 0.08}
                  className={
                    shot.layout === "wide"
                      ? "sm:col-span-2"
                      : shot.layout === "tall"
                        ? "sm:row-span-2"
                        : undefined
                  }
                >
                  <figure className="flex h-full flex-col">
                    <a
                      href={shot.src}
                      target="_blank"
                      rel="noreferrer"
                      className={`group block overflow-hidden border border-border transition-colors duration-500 hover:border-fg ${
                        // Phone shots sit centered on a surface panel that fills the two rows
                        shot.layout === "tall"
                          ? "relative aspect-[4/5] flex-1 bg-surface sm:aspect-auto"
                          : ""
                      }`}
                    >
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        sizes={
                          shot.layout === "wide"
                            ? "(min-width: 900px) 852px, 100vw"
                            : "(min-width: 640px) 426px, 100vw"
                        }
                        className={`transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100 ${
                          shot.layout === "tall"
                            ? "absolute inset-0 size-full object-contain py-6"
                            : "w-full"
                        }`}
                      />
                    </a>
                    {shot.caption && (
                      <figcaption className="mono mt-3 text-muted">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {project.note && (
          <p className="mono border-t border-border py-8 text-muted">
            Note: {project.note}
          </p>
        )}
      </Container>
    </main>
  );
}
