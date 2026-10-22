import Link from "next/link";
import type { Project } from "@/data/projects";
import { ArrowRight, ArrowUpRight } from "./icons";

/** GitHub + live demo buttons, optionally led by a case study button. */
export function ProjectLinks({
  project,
  caseStudy = false,
}: {
  project: Project;
  caseStudy?: boolean;
}) {
  // "#" is a placeholder; the button appears once a real URL is set
  const external = [
    { label: "GitHub", href: project.repoUrl },
    { label: "Live demo", href: project.liveUrl },
  ].filter((link) => link.href && link.href !== "#");

  if (!caseStudy && external.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {caseStudy && (
        <Link href={`/projects/${project.slug}`} className="btn btn-solid mono">
          Case study
          <ArrowRight className="size-3.5" />
        </Link>
      )}
      {external.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="btn mono"
        >
          {link.label}
          <ArrowUpRight className="size-3.5" />
        </a>
      ))}
    </div>
  );
}
