"use client";

import dynamic from "next/dynamic";

const Logo3D = dynamic(
  () => import("@/components/effects/Logo3D").then((m) => m.Logo3D),
  { ssr: false },
);

interface HeroProps {
  headline: string;
  subtext: string;
}

export function Hero({ headline, subtext }: HeroProps) {
  // Two lines: "Visual experiences" / "powered by technology".
  const idx = headline.toLowerCase().indexOf("powered");
  const line1 = idx > 0 ? headline.slice(0, idx).trim() : headline;
  const line2 = idx > 0 ? headline.slice(idx).trim() : "";

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden">
      {/* transparent → the animated depth background (HomeBackground) plays under the logo */}
      <Logo3D transparent className="absolute inset-0" scaleFactor={0.42} lift={0.85} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-[12vh] text-center">
        <h1 className="display text-gradient text-balance text-3xl leading-[0.96] [text-shadow:0_2px_40px_rgba(0,0,0,0.65)] sm:text-5xl md:text-6xl">
          <span className="block">{line1}</span>
          {line2 && <span className="block">{line2}</span>}
        </h1>
        <p className="lead max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.75)]">
          {subtext}
        </p>
        <p className="eyebrow mt-2 animate-float">↓ Przewiń</p>
      </div>
    </section>
  );
}
