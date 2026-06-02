import Link from "next/link";

/** Minimal overlay shared by both demos: wordmark, label, headline, switcher. */
export function DemoChrome({ label, other }: { label: "A" | "B"; other: "a" | "b" }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
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
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
          Demo {label}
        </span>
      </div>

      <div className="mt-auto flex flex-col items-center gap-6 px-6 pb-14 text-center sm:pb-20">
        <h1 className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
          Visual experiences
          <br />
          powered by technology
        </h1>
        <p className="max-w-sm text-sm text-white/55">
          Rusz myszką — tło i logo reagują na ruch. {" "}
          <span className="text-white/35">(demo, pełny ruch)</span>
        </p>
        <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/demo/${other}`}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Zobacz Demo {other.toUpperCase()} →
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/25 px-5 py-2.5 text-sm text-white/80 transition-colors hover:border-white/60"
          >
            Wróć
          </Link>
        </div>
      </div>
    </div>
  );
}
