"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ShaderBackground = dynamic(
  () => import("@/components/effects/ShaderBackground").then((m) => m.ShaderBackground),
  { ssr: false },
);

/**
 * Site-wide animated nebula, fixed behind all content and driven by scroll.
 * On mobile / reduced motion it renders nothing and the static `.site-aurora`
 * (from the layout) shows instead.
 */
export function AnimatedBackground() {
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || reduced || !wide || pathname.startsWith("/demo")) return null;

  // Punchy on the home hero; calm behind content-heavy pages (forms, grids).
  const intensity = pathname === "/" ? 1.1 : 0.5;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[9]" aria-hidden>
      <ShaderBackground intensity={intensity} />
    </div>
  );
}
