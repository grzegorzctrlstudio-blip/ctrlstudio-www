"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePointerFine } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Premium custom cursor: a precise dot + a lagging ring (mix-blend-difference,
 * so it reads on any background). Desktop pointers only; never on touch or
 * reduced motion. Native cursor is hidden via the `has-cursor` body class.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 36, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 36, mass: 0.6 });

  const [active, setActive] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      setActive(!!t?.closest?.("a, button, [data-cursor]"));
    };
    const downFn = () => setDown(true);
    const upFn = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", downFn);
    window.addEventListener("pointerup", upFn);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", downFn);
      window.removeEventListener("pointerup", upFn);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      {/* dot */}
      <motion.div
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white"
        style={{ x, y }}
      />
      {/* ring */}
      <motion.div
        className="absolute rounded-full border border-white"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: active ? 56 : 30,
          height: active ? 56 : 30,
          marginLeft: active ? -28 : -15,
          marginTop: active ? -28 : -15,
          opacity: active ? 0.9 : 0.5,
          scale: down ? 0.82 : 1,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      />
    </div>
  );
}
