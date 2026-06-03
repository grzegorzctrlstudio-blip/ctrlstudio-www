"use client";

import Link from "next/link";
import { Hero } from "@/components/ui/lamp-hero";

export function DemoF() {
  return (
    <div className="relative min-h-svh w-full bg-bg">
      <Hero
        className="min-h-svh"
        title="Visual experiences powered by technology"
        subtitle="Łączymy content, technologię i przestrzeń."
        titleClassName="font-display uppercase text-gradient max-w-[16ch] leading-[0.92]"
        subtitleClassName="text-base md:text-lg"
        actions={[
          { label: "Zobacz realizacje", href: "/work", variant: "outline" },
          { label: "Napisz do nas", href: "/contact", variant: "default" },
        ]}
      />

      <div className="pointer-events-none fixed inset-0 z-[60] flex flex-col">
        <div className="flex items-center justify-between p-6 sm:p-8">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-baseline gap-[0.18em] leading-none text-white"
          >
            <span className="font-display text-xl font-extrabold uppercase tracking-[-0.01em]">
              CTRL
            </span>
            <span className="font-display text-[0.72rem] font-light uppercase tracking-[0.42em]">
              studio
            </span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/55">
            Demo F · Lamp
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-center gap-3 pb-8">
          <Link
            href="/demo/d"
            className="pointer-events-auto rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/60"
          >
            Demo D
          </Link>
          <Link
            href="/demo/e"
            className="pointer-events-auto rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/60"
          >
            Demo E
          </Link>
          <Link
            href="/"
            className="pointer-events-auto rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Wróć
          </Link>
        </div>
      </div>
    </div>
  );
}
