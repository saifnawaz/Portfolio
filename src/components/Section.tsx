import type { ReactNode } from "react";
import { navLinks } from "@/data/site";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

/** Section number and title come from navLinks, so the nav order is the source of truth. */
export function Section({ id, children }: { id: string; children: ReactNode }) {
  const index = navLinks.findIndex((link) => link.href === `#${id}`);
  const number = String(index + 1).padStart(2, "0");
  const title = navLinks[index]?.label ?? id;

  return (
    <section id={id}>
      <Container>
        <div className="border-t border-border py-13 sm:py-18">
          <SectionHeading number={number} title={title} />
          <div className="mt-8 sm:mt-10">{children}</div>
        </div>
      </Container>
    </section>
  );
}
