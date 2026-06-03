"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Cta } from "@/lib/types";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

const Logo3D = dynamic(
  () => import("@/components/effects/Logo3D").then((m) => m.Logo3D),
  { ssr: false },
);

interface HeroProps {
  headline: string;
  subtext: string;
  ctas: Cta[];
}

export function Hero({ headline, subtext, ctas }: HeroProps) {
  const { lenis } = useSmoothScroll();
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Pause Lenis until the showreel is fully expanded, then hand scroll back.
  useEffect(() => {
    if (!lenis) return;
    if (expanded) lenis.start();
    else lenis.stop();
    return () => lenis.start();
  }, [lenis, expanded]);

  const onProgress = useCallback((p: number) => setProgress(p), []);
  const onExpandedChange = useCallback((e: boolean) => setExpanded(e), []);

  // Headline forced to two lines: "Visual experiences" / "powered by technology".
  const idx = headline.toLowerCase().indexOf("powered");
  const line1 = idx > 0 ? headline.slice(0, idx).trim() : headline;
  const line2 = idx > 0 ? headline.slice(idx).trim() : "";

  const logoFade = Math.max(0, 1 - progress * 1.8);

  return (
    <div className="relative">
      <Logo3D fade={logoFade} />

      <ScrollExpandMedia
        transparentBg
        mediaType="video"
        mediaSrc="/assets/hero-bg.mp4"
        taglineWords={["Content", "Technology", "Space"]}
        scrollToExpand="Przewiń, aby rozwinąć"
        onProgress={onProgress}
        onExpandedChange={onExpandedChange}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="display text-gradient text-balance text-3xl leading-[0.96] sm:text-4xl md:text-5xl">
            <span className="block">{line1}</span>
            {line2 && <span className="block">{line2}</span>}
          </h1>
          <p className="lead max-w-xl">{subtext}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {ctas.map((c, i) => (
              <Button
                key={c.href}
                href={c.href}
                variant={i === 0 ? "solid" : "line"}
                arrow={i === 0}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
