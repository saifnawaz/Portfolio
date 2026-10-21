import { contact, site } from "@/data/site";
import { ArrowUpRight } from "../icons";
import { Reveal } from "../Reveal";
import { Section } from "../Section";

const socials = [
  { label: "GitHub", href: contact.github },
  { label: "LinkedIn", href: contact.linkedin },
];

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          {site.contactLine}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="link-u mt-6 inline-block text-[clamp(1.75rem,6.5vw,3.75rem)] leading-tight font-extrabold tracking-[-0.03em] break-all after:h-[3px]"
        >
          {contact.email}
        </a>
        <ul className="mt-8 flex gap-8">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="mono link-u group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
              >
                {social.label}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
