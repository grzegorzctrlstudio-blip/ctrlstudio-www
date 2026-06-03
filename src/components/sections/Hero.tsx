"use client";

import type { Cta } from "@/lib/types";
import { Hero as LampHero } from "@/components/ui/lamp-hero";

interface HeroProps {
  headline: string;
  subtext: string;
  ctas: Cta[];
}

export function Hero({ headline, subtext, ctas }: HeroProps) {
  return (
    <LampHero
      className="min-h-svh"
      title={headline}
      subtitle={subtext}
      titleClassName="display max-w-[16ch] text-gradient text-balance"
      subtitleClassName="mx-auto max-w-xl text-base text-ink-dim md:text-lg"
      actions={ctas.map((c, i) => ({
        label: c.label,
        href: c.href,
        variant: i === 0 ? "default" : "outline",
      }))}
    />
  );
}
