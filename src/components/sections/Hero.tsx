"use client";

import dynamic from "next/dynamic";
import type { Cta } from "@/lib/types";
import { Button } from "@/components/ui/Button";

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
  // Two lines: "Visual experiences" / "powered by technology".
  const idx = headline.toLowerCase().indexOf("powered");
  const line1 = idx > 0 ? headline.slice(0, idx).trim() : headline;
  const line2 = idx > 0 ? headline.slice(idx).trim() : "";

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden">
      {/* real 3D chrome logo (mouse-reactive), fills the hero, raised above the text */}
      <Logo3D className="absolute inset-0 bg-bg" scaleFactor={0.42} lift={0.8} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-[12vh] text-center">
        <h1 className="display text-gradient text-balance text-3xl leading-[0.96] [text-shadow:0_2px_40px_rgba(0,0,0,0.5)] sm:text-5xl md:text-6xl">
          <span className="block">{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </h1>
        <p className="lead max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
          {subtext}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
        <p className="eyebrow mt-2 animate-float">↓ Przewiń</p>
      </div>
    </section>
  );
}
