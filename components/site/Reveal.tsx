"use client";

/**
 * Motion leaf (skill §3.A / §5.C). Entrance + scroll-reveal, fires ONCE,
 * transform/opacity only, honors prefers-reduced-motion (collapses to static).
 * MOTION_INTENSITY: 4 — a calm fade/translate, no scroll-hijack, no loops.
 */
import { motion, useReducedMotion, type Variants } from "motion/react";

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  shown: { opacity: 1, y: 0 },
};

export default function Reveal({
  children,
  delay = 0,
  trigger = "view",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  /** "view" = reveal on scroll into view; "mount" = animate on load (hero). */
  trigger?: "view" | "mount";
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  const animateProps =
    trigger === "mount"
      ? { animate: "shown" as const }
      : {
          whileInView: "shown" as const,
          viewport: { once: true, amount: 0.25 },
        };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={variants}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...animateProps}
    >
      {children}
    </motion.div>
  );
}
