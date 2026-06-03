"use client";

import { useCallback, useEffect, useState } from "react";
import type { Cta } from "@/lib/types";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

interface HeroProps {
  headline: string;
  subtext: string;
  ctas: Cta[];
}

export function Hero({ headline, subtext, ctas }: HeroProps) {
  const { lenis } = useSmoothScroll();
  const [expanded, setExpanded] = useState(false);

  // The scroll-expand hero hijacks the wheel to grow the media, so Lenis must
  // stay paused until the media is fully expanded — then we hand control back
  // so the page scrolls normally into the sections below. This depends on
  // `lenis` (which is created *after* this component mounts), so the pause
  // actually takes effect once the instance exists.
  useEffect(() => {
    if (!lenis) return;
    if (expanded) lenis.start();
    else lenis.stop();
    return () => lenis.start();
  }, [lenis, expanded]);

  const handleExpandedChange = useCallback((e: boolean) => setExpanded(e), []);

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/assets/hero-bg.mp4"
      title="CTRL STUDIO"
      date="Content × Technology × Space"
      scrollToExpand="Przewiń, aby rozwinąć"
      onExpandedChange={handleExpandedChange}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="eyebrow">Creative-technology partner</p>
        <h1 className="display text-gradient text-balance max-w-[18ch] text-3xl sm:text-4xl md:text-5xl">
          {headline}
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
  );
}
