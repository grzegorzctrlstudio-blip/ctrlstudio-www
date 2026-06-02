"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const Scene = dynamic(
  () => import("@/components/demo/DemoSceneD").then((m) => m.DemoSceneD),
  { ssr: false },
);

export function DemoD() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#dfe3f1]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(42% 52% at 50% 26%, rgba(255,205,180,0.4), transparent 70%), radial-gradient(55% 60% at 16% 24%, rgba(196,208,255,0.55), transparent 72%), radial-gradient(55% 60% at 88% 74%, rgba(255,205,235,0.5), transparent 72%)",
        }}
      />

      <div className="absolute inset-0 z-[2]">
        <Scene />
      </div>

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
            Demo D · B + C
          </span>
        </div>

        <div className="mt-auto flex flex-col items-center gap-5 px-6 pb-12 text-center">
          <h1 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-[#0c0c12] sm:text-4xl">
            Visual experiences
            <br />
            powered by technology
          </h1>
          <p className="max-w-sm text-sm text-black/55">
            Szkło z odbiciami i cieniami, w środku logo CTRL z cząsteczek. Rusz
            myszką. <span className="text-black/35">(demo, pełny ruch)</span>
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/demo/b"
              className="rounded-full border border-black/20 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/60"
            >
              Demo B
            </Link>
            <Link
              href="/demo/c"
              className="rounded-full border border-black/20 px-4 py-2 text-sm text-black/70 transition-colors hover:border-black/60"
            >
              Demo C
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
