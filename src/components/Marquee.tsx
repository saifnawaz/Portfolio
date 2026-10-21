import type { CSSProperties } from "react";
import { Dot } from "./Dot";

// Each copy repeats the list until it has at least this many chips, so the
// loop never shows a gap, even with short lists on wide screens.
const MIN_CHIPS = 10;
const SECONDS_PER_CHIP = 2.6;

export function Marquee({
  items,
  reverse = false,
  highlight = false,
}: {
  items: string[];
  reverse?: boolean;
  highlight?: boolean;
}) {
  const repeats = Math.ceil(MIN_CHIPS / items.length);
  const chips = Array.from({ length: repeats }, () => items).flat();
  const style = {
    "--duration": `${chips.length * SECONDS_PER_CHIP}s`,
  } as CSSProperties;

  return (
    <div className="marquee" data-reverse={reverse || undefined} style={style}>
      <div className="marquee-track py-2">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            // The second copy and repeated chips are visual only.
            className={`flex shrink-0 gap-3 pr-3 ${copy === 1 ? "marquee-dup" : ""}`}
            aria-hidden={copy === 1 || undefined}
          >
            {chips.map((chip, i) => {
              const duplicate = copy === 0 && i >= items.length;
              return (
                <li
                  key={i}
                  className={duplicate ? "marquee-dup" : undefined}
                  aria-hidden={duplicate || undefined}
                >
                  <span
                    className={`mono inline-flex items-center gap-2 rounded-full border px-4 py-2 whitespace-nowrap transition duration-300 ease-out hover:scale-[1.06] hover:border-accent hover:bg-accent hover:text-on-accent ${
                      highlight ? "border-fg text-fg" : "border-fg/70 text-fg"
                    }`}
                  >
                    {highlight && <Dot />}
                    {chip}
                  </span>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
}
