/**
 * Letters lift slightly and lean away from the mouse, then ease back.
 * Exponential smoothing (no spring overshoot) keeps it calm. Mouse only,
 * off for reduced motion, and the animation loop stops once letters settle.
 */
const LIFT = 0.055; // max upward move, in em
const PUSH = 0.02; // max sideways move, in em
const REACH = 0.5; // falloff radius, in em
const EASE = 0.12; // smoothing per 60fps frame (higher = snappier)

export function initLetterField(hero, chars, { isActive = () => true } = {}) {
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || reduced || !chars.length) return;

  const text = chars[0].closest(".hero__name-text");
  const state = chars.map(() => ({ x: 0, y: 0, cx: 0, cy: 0 }));
  let pointer = null; // { x, y } in viewport coords, or null when away
  let frame = 0;
  let last = 0;
  let measured = false;

  // Letter centres in the name's own coordinates. offset* values ignore
  // transforms, so the intro and the letters' own movement don't skew them.
  const measure = () => {
    chars.forEach((char, i) => {
      state[i].cx = char.offsetLeft - text.offsetLeft + char.offsetWidth / 2;
      state[i].cy = char.offsetTop - text.offsetTop + char.offsetHeight / 2;
    });
    measured = true;
  };

  const tick = (now) => {
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.67 || 1);

    const box = text.getBoundingClientRect();
    const scale = box.width / text.offsetWidth || 1;
    const em = parseFloat(getComputedStyle(text).fontSize);
    const active = pointer && isActive();
    const px = active ? (pointer.x - box.left) / scale : 0;
    const py = active ? (pointer.y - box.top) / scale : 0;

    let moving = false;
    chars.forEach((char, i) => {
      const s = state[i];
      let tx = 0;
      let ty = 0;
      if (active) {
        const dx = px - s.cx;
        const dy = py - s.cy;
        const reach = REACH * em;
        const f = Math.exp(-(dx * dx + dy * dy) / (2 * reach * reach));
        ty = -LIFT * em * f;
        tx = -(dx / reach) * PUSH * em * f;
      }
      s.x += (tx - s.x) * k;
      s.y += (ty - s.y) * k;
      if (Math.abs(tx - s.x) > 0.05 || Math.abs(ty - s.y) > 0.05) moving = true;
      char.style.transform = moving || active ? `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)` : "";
    });

    frame = moving || active ? requestAnimationFrame(tick) : 0;
    if (!frame) last = 0;
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (!measured) measure();
    pointer = { x: event.clientX, y: event.clientY };
    start();
  });
  hero.addEventListener("pointerleave", () => {
    pointer = null;
    start();
  });
  window.addEventListener("resize", () => (measured = false));
}
