import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo — koncepcje hero",
  robots: { index: false, follow: false },
};

export default function DemoIndex() {
  return (
    <section className="relative grid min-h-svh place-items-center px-6">
      <div className="flex w-full max-w-4xl flex-col items-center gap-10 text-center">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Koncepcje hero</span>
          <h1 className="display-xl text-gradient">Wybierz kierunek</h1>
          <p className="lead mx-auto max-w-md">
            Dwie propozycje hero w klimacie Hubtown. Otwórz oba, porusz myszką,
            powiedz które robimy.
          </p>
        </div>
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <DemoLink
            href="/demo/a"
            tag="Demo A · ciemny"
            title="Liquid Glass"
            desc="Logo z ciekłego szkła — refrakcja, chromatyczne krawędzie."
          />
          <DemoLink
            href="/demo/b"
            tag="Demo B · ciemny"
            title="Particle Field"
            desc="Logo z tysięcy świecących punktów — odpływają od kursora."
          />
          <DemoLink
            href="/demo/c"
            tag="Demo C · jasny"
            title="Noomo"
            desc="Jasno, wielka typografia, szklane bryły 3D + organiczny blob."
          />
        </div>
        <Link href="/" className="text-sm text-ink-dim transition-colors hover:text-ink">
          ← Wróć na stronę
        </Link>
      </div>
    </section>
  );
}

function DemoLink({
  href,
  tag,
  title,
  desc,
}: {
  href: string;
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-bg-raised p-6 text-left transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-ink">
        {tag}
      </span>
      <span className="display-lg text-ink">{title}</span>
      <span className="text-sm leading-relaxed text-ink-dim">{desc}</span>
      <span className="mt-2 text-sm text-ink-dim transition-transform group-hover:translate-x-1">
        Otwórz →
      </span>
    </Link>
  );
}
