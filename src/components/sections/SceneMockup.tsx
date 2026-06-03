"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SceneBackground = dynamic(
  () =>
    import("@/components/effects/SceneBackground").then((m) => m.SceneBackground),
  { ssr: false },
);

const STYLE_NAMES = ["Nebula Flow", "Architectural Chrome"];
const SECTIONS = ["Hero", "Showreel", "Co robimy", "Proces"];

const SERVICES = [
  ["Content & film", "Produkcje wideo, motion i treści, które niosą historię marki."],
  ["Technologia & interakcja", "Instalacje interaktywne, real-time, sterowanie i sensory."],
  ["Przestrzeń & scenografia", "Mapping, ekrany, światło i obiekty w realnej przestrzeni."],
  ["Realizacja end-to-end", "Od koncepcji, przez produkcję, po montaż na miejscu."],
];

const STEPS = [
  ["01", "Odkrycie", "Brief, cel, kontekst miejsca i widza."],
  ["02", "Koncept", "Kierunek wizualny, technologia, scenariusz doświadczenia."],
  ["03", "Produkcja", "Content, oprogramowanie i elementy przestrzeni."],
  ["04", "Wdrożenie", "Montaż, testy i uruchomienie na miejscu."],
];

export function SceneMockup() {
  const [styleIndex, setStyleIndex] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      setActive(Math.round(p * (SECTIONS.length - 1)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative">
      <SceneBackground styleIndex={styleIndex} />

      {/* fixed UI */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-4 p-5 md:p-7">
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-dim transition-colors hover:text-ink"
          >
            ← CTRLstudio
          </Link>
          <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">
            Podgląd tła · {STYLE_NAMES[styleIndex]}
          </p>
          <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-accent-ink">
            {String(active + 1).padStart(2, "0")} / {SECTIONS[active]}
          </p>
        </div>

        <div className="pointer-events-auto flex gap-1.5 rounded-full border border-line-strong bg-bg/40 p-1 backdrop-blur-md">
          {STYLE_NAMES.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => setStyleIndex(i)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium transition-colors",
                styleIndex === i
                  ? "bg-ink text-bg"
                  : "text-ink-dim hover:text-ink",
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* sections */}
      <main className="relative z-10">
        {/* 1 — Hero */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
            Creative-technology partner
          </p>
          <h1 className="display mt-6 max-w-[16ch] text-gradient text-4xl [text-shadow:0_2px_40px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
            Visual experiences powered by technology
          </h1>
          <p className="lead mt-6 max-w-xl [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
            Łączymy content, technologię i przestrzeń w doświadczenia, które
            ożywają w realnym świecie.
          </p>
          <p className="mt-12 animate-float font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-dim">
            ↓ przewiń — tło reaguje
          </p>
        </section>

        {/* 2 — Showreel */}
        <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
            01 — Showreel
          </p>
          <h2 className="display-xl mt-6 max-w-[20ch] [text-shadow:0_2px_40px_rgba(0,0,0,0.6)]">
            Zobacz, jak obraz, ruch i technologia pracują razem w przestrzeni.
          </h2>
        </section>

        {/* 3 — Co robimy */}
        <section className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-16">
          <div className="container-x">
            <p className="eyebrow [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
              02 — Co robimy
            </p>
            <h2 className="display-lg mt-5 max-w-[18ch] [text-shadow:0_2px_40px_rgba(0,0,0,0.6)]">
              Cztery filary, jedno doświadczenie
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {SERVICES.map(([title, desc]) => (
                <div key={title} className="bg-bg/55 p-7 backdrop-blur-md">
                  <h3 className="font-display text-xl uppercase tracking-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4 — Proces */}
        <section className="flex min-h-screen flex-col justify-center px-6 py-24 md:px-16">
          <div className="container-x">
            <p className="eyebrow [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
              03 — Proces
            </p>
            <h2 className="display-lg mt-5 max-w-[16ch] [text-shadow:0_2px_40px_rgba(0,0,0,0.6)]">
              Od pomysłu do realizacji
            </h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
              {STEPS.map(([no, title, desc]) => (
                <div key={no} className="bg-bg/55 p-7 backdrop-blur-md">
                  <span className="font-mono text-xs text-accent-ink">{no}</span>
                  <h3 className="mt-3 font-display text-lg uppercase tracking-tight text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link
                href="/"
                className="inline-flex rounded-full border border-line-strong px-5 py-2.5 text-sm text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent-ink"
              >
                ← Wróć na stronę główną
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
