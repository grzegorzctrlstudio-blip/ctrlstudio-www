"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePointerFine } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MouseLightProps {
  className?: string;
  /** CSS size of the light pool, e.g. "32rem". */
  size?: string;
  /** 0–1 strength of the accent tint. */
  intensity?: number;
}

/**
 * A soft accent light that follows the cursor inside its (relative) parent.
 * Falls back to a centered static glow on touch / reduced motion.
 */
export function MouseLight({
  className,
  size = "34rem",
  intensity = 0.22,
}: MouseLightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const interactive = fine && !reduced;

  useEffect(() => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [interactive]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        background: `radial-gradient(${size} ${size} at var(--mx, 50%) var(--my, 35%), color-mix(in oklab, var(--accent) ${Math.round(
          intensity * 100,
        )}%, transparent), transparent 62%)`,
      }}
    />
  );
}
