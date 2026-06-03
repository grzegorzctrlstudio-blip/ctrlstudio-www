"use client";

import { useEffect } from "react";
import Link from "next/link";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { getLenis } from "@/components/providers/SmoothScroll";

/**
 * Isolated preview of the scroll-expand hero. This component hijacks the wheel
 * to drive its expand animation, so the global Lenis smooth-scroll must stand
 * down while it's mounted (otherwise the two fight over the scroll position).
 */
export function ScrollHeroPreview() {
  useEffect(() => {
    getLenis()?.stop();
    return () => {
      getLenis()?.start();
    };
  }, []);

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/assets/hero-bg.mp4"
      title="CTRL STUDIO"
      date="Creative-technology partner"
      scrollToExpand="Przewiń, aby rozwinąć"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="eyebrow">Content · Technology · Space</p>
        <h3 className="display-lg text-gradient">
          Doświadczenia wizualne napędzane technologią
        </h3>
        <p className="lead">
          Łączymy content, technologię i przestrzeń w instalacje, scenografie
          i treści, które ożywają w realnym świecie — dla marek, wydarzeń
          i miejsc.
        </p>
        <p className="text-sm text-ink-faint">
          To podgląd alternatywnego hero (scroll-expand) na osobnej trasie —
          nie zmienia jeszcze strony głównej.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent-ink"
        >
          ← Wróć na stronę główną
        </Link>
      </div>
    </ScrollExpandMedia>
  );
}
