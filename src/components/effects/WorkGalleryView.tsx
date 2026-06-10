"use client";

import dynamic from "next/dynamic";
import type { WorkItem } from "./WorkGridScene";

const Scene = dynamic(
  () => import("./WorkGridScene").then((m) => m.WorkGridScene),
  { ssr: false },
);

/** Full-screen draggable infinite tile grid for the /work page. */
export function WorkGalleryView({ items }: { items: WorkItem[] }) {
  return (
    <section className="relative h-[100svh] w-full cursor-grab overflow-hidden bg-bg active:cursor-grabbing">
      <Scene items={items} />

      <div className="pointer-events-none absolute left-6 top-28 z-10 md:left-10">
        <p className="eyebrow">Realizacje</p>
        <h1 className="display-lg mt-2 text-ink [text-shadow:0_2px_30px_rgba(0,0,0,0.6)]">
          Wybrane realizacje
        </h1>
        <p className="mt-3 text-sm text-ink-dim">
          Przeciągnij, aby przeglądać ↔ &nbsp;·&nbsp; kliknij kafel, by otworzyć
        </p>
      </div>
    </section>
  );
}

export default WorkGalleryView;
