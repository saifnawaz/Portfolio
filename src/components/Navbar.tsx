"use client";

import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color] duration-300 ${
        solid
          ? "border-border bg-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Plain <a> so Lenis smooth-scrolls on the home page */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/#top"
          className="text-lg font-extrabold tracking-[-0.03em]"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </a>

        <nav aria-label="Primary" className="flex items-center gap-2">
          <ul className="hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={`/${link.href}`}
                  className="mono link-u text-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="ml-2 hidden h-4 w-px bg-border sm:block" aria-hidden />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="size-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {/* Overlays the page instead of pushing it down, so anchor targets don't shift when it closes */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-border bg-bg sm:hidden"
      >
        <Container>
          <ul className="flex flex-col py-3">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <a
                  href={`/${link.href}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3 text-2xl font-bold tracking-[-0.03em]"
                >
                  <span className="mono text-fg">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </header>
  );
}
