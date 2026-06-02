"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Scene = dynamic(
  () => import("@/components/demo/DemoSceneD").then((m) => m.DemoSceneD),
  { ssr: false },
);

export function DemoD() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#05060c]">
      {/* deep-blue atmosphere (B colourway) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 32%, rgba(60,90,200,0.30), transparent 70%), radial-gradient(55% 60% at 18% 22%, rgba(40,110,200,0.22), transparent 72%), radial-gradient(55% 60% at 85% 72%, rgba(80,60,200,0.20), transparent 72%)",
        }}
      />

      <div className="absolute inset-0 z-[2]">
        <Scene />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col">
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
            Demo D · B + C
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center gap-5 px-6 pb-12 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-4xl">
            Visual experiences
            <br />
            powered by technology
          </h1>
          <p className="max-w-sm text-sm text-white/55">
            Logo CTRL ze szkła — refrakcja, iryzacja, odbicia i lustrzana tafla.
            Rusz myszką. <span className="text-white/35">(demo, pełny ruch)</span>
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/b"
              className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/60"
            >
              Demo B
            </Link>
            <Link
              href="/demo/c"
              className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/60"
            >
              Demo C
            </Link>
            <Link
              href="/"
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white/85"
            >
              Wróć
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
