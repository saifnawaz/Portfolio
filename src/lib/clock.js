/**
 * Live local time for any <time data-clock data-tz="Asia/Karachi" data-suffix="UTC+5">.
 * Without JS the prerendered fallback text (e.g. "UTC+5") stays.
 */
export function initClock(root = document) {
  const clocks = [...root.querySelectorAll("[data-clock]")].map((element) => ({
    element,
    suffix: element.dataset.suffix ? ` ${element.dataset.suffix}` : "",
    format: new Intl.DateTimeFormat("en-GB", {
      timeZone: element.dataset.tz || undefined,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }),
  }));
  if (!clocks.length) return;

  const tick = () => {
    const now = new Date();
    for (const { element, format, suffix } of clocks) {
      const time = format.format(now);
      element.textContent = time + suffix;
      element.setAttribute("datetime", time);
    }
  };

  tick();
  // Line up with the start of the next minute, then tick every minute.
  setTimeout(() => {
    tick();
    setInterval(tick, 60_000);
  }, 60_000 - (Date.now() % 60_000));
}
