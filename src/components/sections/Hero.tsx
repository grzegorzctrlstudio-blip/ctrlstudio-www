"use client";

import type { Cta } from "@/lib/types";
import { Hero as LampHero } from "@/components/ui/lamp-hero";
import { ParticleBackground } from "@/components/effects/ParticleBackground";

interface HeroProps {
  headline: string;
  subtext: string;
  ctas: Cta[];
}

export function Hero({ headline, subtext, ctas }: HeroProps) {
  return (
    <LampHero
      className="min-h-svh"
      fx={
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          >
            <source src="/assets/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-bg/65 via-bg/45 to-bg" />
          <ParticleBackground density={0.8} />
        </>
      }
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
