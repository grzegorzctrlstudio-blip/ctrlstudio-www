import type { Homepage } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function TechnologyLayer({ data }: { data: Homepage["technology"] }) {
  return (
    <section className="section overflow-hidden border-y border-line bg-bg-raised/40">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <Reveal>
            <span className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-line-strong" />
              Technologia jako wsparcie
            </span>
          </Reveal>
          <TextReveal as="h2" text={data.title} className="display-lg text-gradient max-w-[16ch]" />
        </div>
        <Reveal delay={0.1}>
          <p className="lead max-w-2xl">{data.text}</p>
        </Reveal>
      </div>

      {/* slow marquee of supporting capabilities */}
      <div className="relative mt-16 flex w-full select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <TagTrack tags={data.tags} />
        <TagTrack tags={data.tags} ariaHidden />
      </div>
    </section>
  );
}

function TagTrack({ tags, ariaHidden }: { tags: string[]; ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="marquee-track flex shrink-0 items-center gap-8 pr-8 font-display text-3xl uppercase text-ink-faint sm:text-4xl"
    >
      {tags.map((tag, i) => (
        <li key={`${tag}-${i}`} className="flex items-center gap-8">
          <span className="transition-colors hover:text-ink">{tag}</span>
          <span className="text-accent/60" aria-hidden>
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}
