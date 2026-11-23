/**
 * Page background: a fixed dot grid (canvas) behind everything.
 * Dots near the mouse warm up to red and grow slightly, then ease back.
 * Touch (lib/touch.js): dots under a finger warm up the same way, and while
 * idle a slow, faint wave of brightness drifts across the grid (~30fps).
 * Reduced motion gets the static grid only. With a mouse the loop runs only
 * while dots are warm; it always pauses when the tab is hidden; DPR is capped.
 */
import "./background.css";
import { onResize, reducedMotion } from "../lib/scroll.js";
import { touchMode } from "../lib/touch.js";

const GAP = 24; // px between dots
const DOT = 1; // base radius, px
const REACH = 120; // cursor influence radius, px
const GROW = 1.8; // extra radius at full heat (x DOT)
const EASE = 0.14; // smoothing per 60fps frame
const MAX_DPR = 2;
const BASE_COLOR = "rgba(239, 237, 232, 0.08)";
const HOT = "255, 59, 48"; // --accent
const WAVE_ALPHA = 0.12; // extra dot opacity at the wave's crest (base is 0.08)
const WAVE_LENGTH = 700; // px between crests
const WAVE_PERIOD = 14000; // ms for a crest to travel one wavelength
const WAVE_LEVELS = 6; // opacity steps (one path each)
const WAVE_FRAME = 33; // ms between idle frames (~30fps)

export function initBackground() {
  const canvas = Object.assign(document.createElement("canvas"), { className: "dot-grid" });
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const base = document.createElement("canvas");
  const interactive = !reducedMotion && matchMedia("(hover: hover) and (pointer: fine)").matches;
  const touch = !reducedMotion && touchMode();

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  const heat = new Map(); // dot index -> 0..1
  let pointer = null;
  let frame = 0;
  let last = 0;

  const dotX = (col) => GAP / 2 + col * GAP;
  const dotY = (row) => GAP / 2 + row * GAP;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;
    cols = Math.ceil(width / GAP);
    rows = Math.ceil(height / GAP);
    for (const c of [canvas, base]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
    const b = base.getContext("2d");
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    b.fillStyle = BASE_COLOR;
    b.beginPath();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        b.moveTo(dotX(col) + DOT, dotY(row));
        b.arc(dotX(col), dotY(row), DOT, 0, Math.PI * 2);
      }
    }
    b.fill();
    heat.clear();
    draw();
  };

  // Idle wave (touch): diagonal bands of slightly brighter dots, drifting down-right.
  const drawWave = (now) => {
    const shift = (now / WAVE_PERIOD) % 1;
    const paths = Array.from({ length: WAVE_LEVELS }, () => new Path2D());
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = dotX(col);
        const y = dotY(row);
        const phase = (x * 0.6 + y) / WAVE_LENGTH - shift;
        const level = Math.pow(0.5 + 0.5 * Math.sin(phase * Math.PI * 2), 3);
        const step = Math.round(level * WAVE_LEVELS) - 1;
        if (step < 0) continue;
        paths[step].moveTo(x + DOT, y);
        paths[step].arc(x, y, DOT, 0, Math.PI * 2);
      }
    }
    paths.forEach((path, step) => {
      ctx.fillStyle = `rgba(239, 237, 232, ${(((step + 1) / WAVE_LEVELS) * WAVE_ALPHA).toFixed(3)})`;
      ctx.fill(path);
    });
  };

  const draw = (now = performance.now()) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(base, 0, 0);
    if (!heat.size && !touch) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (touch) drawWave(now);
    for (const [index, level] of heat) {
      const x = dotX(index % cols);
      const y = dotY(Math.floor(index / cols));
      ctx.fillStyle = `rgba(${HOT}, ${(0.35 + 0.65 * level).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, DOT * (1 + GROW * level), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  let drawn = 0; // time of the last idle (wave-only) frame
  const tick = (now) => {
    // Nothing warm on touch: only the slow wave moves, so ~30fps is plenty.
    if (touch && !heat.size && !pointer && now - drawn < WAVE_FRAME) {
      frame = document.hidden ? 0 : requestAnimationFrame(tick);
      last = 0;
      return;
    }
    drawn = now;
    const dt = Math.min(now - (last || now), 64);
    last = now;
    const k = 1 - Math.pow(1 - EASE, dt / 16.67 || 1);

    // Targets: dots within reach of the cursor.
    const targets = new Map();
    if (pointer) {
      const c0 = Math.max(0, Math.floor((pointer.x - REACH) / GAP));
      const c1 = Math.min(cols - 1, Math.ceil((pointer.x + REACH) / GAP));
      const r0 = Math.max(0, Math.floor((pointer.y - REACH) / GAP));
      const r1 = Math.ceil((pointer.y + REACH) / GAP);
      for (let row = r0; row <= r1; row++) {
        for (let col = c0; col <= c1; col++) {
          const d = Math.hypot(dotX(col) - pointer.x, dotY(row) - pointer.y);
          if (d >= REACH) continue;
          const t = 1 - d / REACH;
          targets.set(row * cols + col, t * t * (3 - 2 * t)); // smoothstep falloff
        }
      }
    }
    for (const index of targets.keys()) if (!heat.has(index)) heat.set(index, 0);
    for (const [index, level] of heat) {
      const target = targets.get(index) ?? 0;
      const next = level + (target - level) * k;
      if (target === 0 && next < 0.01) heat.delete(index);
      else heat.set(index, next);
    }

    draw(now);
    frame = (heat.size || touch) && !document.hidden ? requestAnimationFrame(tick) : 0;
    if (!frame) last = 0;
  };

  const start = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
  };

  resize();
  onResize(resize);
  if (!interactive && !touch) return;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    } else start();
  });

  if (touch) {
    // Touch events, not pointer events: they keep coming while the finger
    // scrolls the page (pointer events are cancelled once a scroll starts).
    const follow = (event) => {
      const t = event.touches[0];
      pointer = t ? { x: t.clientX, y: t.clientY } : null;
      start();
    };
    for (const type of ["touchstart", "touchmove", "touchend", "touchcancel"]) {
      window.addEventListener(type, follow, { passive: true });
    }
    start(); // the idle wave
  }
  if (!interactive) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      start();
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
    start();
  });
}
