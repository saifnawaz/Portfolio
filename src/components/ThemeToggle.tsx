"use client";

import { useLayoutEffect } from "react";

export const THEME_STORAGE_KEY = "theme";

export function ThemeToggle() {
  // Strict Mode's dev remount resets <html> attributes, so re-apply the stored
  // theme. In production the inline script in layout.tsx already did this.
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) document.documentElement.dataset.theme = stored;
    } catch {}
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  // Both icons are rendered and CSS picks one, so the server markup never
  // needs to know the theme and there is no hydration mismatch.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg focus-visible:outline-2 focus-visible:outline-fg"
    >
      <svg
        className="hidden size-[18px] dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg
        className="block size-[18px] dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
    </button>
  );
}
