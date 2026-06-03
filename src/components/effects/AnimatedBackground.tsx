"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  const wide = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (
    !mounted ||
    !wide ||
    pathname.startsWith("/scroll") ||
    pathname.startsWith("/tlo") ||
    pathname.startsWith("/logo3d")
  )
    return null;

  // Subtle, atmospheric — the lamp hero covers it up top; it only breathes
  // behind the content sections, so keep it calm.
  const intensity = pathname === "/" ? 0.7 : 0.45;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[9]" aria-hidden>
      <ShaderBackground intensity={intensity} />
    </div>
  );
}
