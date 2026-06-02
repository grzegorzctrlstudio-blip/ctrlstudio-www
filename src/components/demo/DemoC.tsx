"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Scene = dynamic(
  () => import("@/components/demo/DemoSceneC").then((m) => m.DemoSceneC),
  { ssr: false },
);

export function DemoC() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#dde2f1]">
      {/* soft light blooms */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 50% at 52% 28%, rgba(255,205,180,0.45), transparent 70%), radial-gradient(55% 60% at 18% 22%, rgba(198,210,255,0.6), transparent 72%), radial-gradient(55% 60% at 86% 72%, rgba(255,205,235,0.5), transparent 72%)",
        }}
      />

      {/* big headline (behind the glass) */}
      <div className="absolute inset-0 z-[1] grid place-items-center px-6">
        <h1 className="text-center font-display text-[14vw] font-extrabold uppercase leading-[0.86] tracking-tight text-[#0c0c12] sm:text-[12vw]">
          Visual
          <br />
          Experiences
        </h1>
      </div>

      {/* 3D objects on top (transparent canvas) */}
      <div className="absolute inset-0 z-[2]">
        <Scene />
      </div>

      {/* light chrome */}
      <div className="pointer-events-none absolute inset-0 z-[3] flex flex-col">
        <div className="flex items-center justify-between p-6 sm:p-8">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-baseline gap-[0.18em] leading-none text-black"
          >
            <span className="font-display text-xl font-extrabold uppercase tracking-[-0.01em]">
              CTRL
            </span>
            <span className="font-display text-[0.72rem] font-light uppercase tracking-[0.42em]">
              studio
            </span>
          </Link>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-black/50">
            Demo C
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center gap-5 px-6 pb-12 text-center">
          <p className="max-w-sm text-sm text-black/55">
            Klimat Noomo — jasno, wielka typografia, szkło 3D. Rusz myszką.{" "}
            <span className="text-black/35">(demo, pełny ruch)</span>
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/a"
              className="rounded-full border border-black/20 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/60"
            >
              Demo A
            </Link>
            <Link
              href="/demo/b"
              className="rounded-full border border-black/20 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/60"
            >
              Demo B
            </Link>
            <Link
              href="/"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80"
            >
              Wróć
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
