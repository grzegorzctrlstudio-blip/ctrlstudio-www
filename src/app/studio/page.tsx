import type { Metadata } from "next";
import { getHomepage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Process } from "@/components/sections/Process";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = buildMetadata({
  title: "Studio",
  description:
    "CTRLstudio działa na styku obrazu, technologii i przestrzeni. Łączymy kreację z technicznym wdrożeniem — projekty, które dobrze wyglądają i działają w realnych warunkach.",
  path: "/studio",
});

const approach = [
  {
    key: "Content",
    text: "Obraz, animacja, ruch i dźwięk — warstwa, którą widać i którą się zapamiętuje.",
  },
  {
    key: "Technologia",
    text: "Ekrany, projekcja, sensory, systemy — dobierane do zadania, nie odwrotnie.",
  },
  {
    key: "Przestrzeń",
    text: "Scena, stoisko, ekspozycja, showroom — projektujemy z myślą o realnym miejscu.",
  },
];

export default async function StudioPage() {
  const home = await getHomepage();

  return (
    <>
      <PageIntro
        eyebrow="Studio"
        title="Na styku obrazu, technologii i przestrzeni"
        intro={home.studioTeaser.text}
      />

      <BrandStatement data={home.brand} />

      {/* approach: content · technology · space */}
      <section className="section pt-0">
        <div className="container-x grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {approach.map((a, i) => (
            <Reveal key={a.key} delay={i * 0.08}>
              <div className="flex h-full flex-col gap-4 bg-bg p-8 lg:p-10">
                <span className="font-mono text-xs uppercase tracking-[0.28em] text-accent-ink">
                  0{i + 1}
                </span>
                <h2 className="display-lg text-ink">{a.key}</h2>
                <p className="text-base leading-relaxed text-ink-dim">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Process data={home.process} />

      <ContactCTA data={home.contactCta} />
    </>
  );
}
