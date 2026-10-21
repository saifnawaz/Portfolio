import type { Variants } from "framer-motion";

// Expo-style ease-out: fast start, long soft landing.
export const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Fade + rise. Pass a delay in seconds through `custom`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay },
  }),
};

/** Text sliding up from behind an overflow-hidden mask. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.9, ease } },
};

/** Parent for the hero name letters; children use `maskUp`. */
export const letterStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } },
};
