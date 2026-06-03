"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Logo3D = dynamic(
  () => import("@/components/effects/Logo3D").then((m) => m.Logo3D),
  { ssr: false },
);

export function Logo3DHero() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Logo3D />

      <div className="pointer-events-none relative z-10 flex min-h-screen flex-col">
        <div className="flex items-start justify-between p-6 md:p-8">
          <div className="pointer-events-auto">
            <Link
              href="/"
              className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-dim transition-colors hover:text-ink"
            >
              ← CTRLstudio
            </Link>
            <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">
              Podgląd · Logo 3D
            </p>
          </div>
        </div>

        <div className="mt-auto px-6 pb-16 text-center md:pb-20">
          <p className="eyebrow [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]">
            Creative-technology partner
          </p>
          <h1 className="display mt-4 text-gradient text-3xl leading-[0.95] [text-shadow:0_2px_40px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl">
            Visual experiences
            <br />
            powered by technology
          </h1>
        </div>
      </div>
    </div>
  );
}
