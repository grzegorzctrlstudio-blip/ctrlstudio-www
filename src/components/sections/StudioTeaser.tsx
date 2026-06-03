import type { Homepage } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";
import { Parallax } from "@/components/effects/Parallax";

export function StudioTeaser({ data }: { data: Homepage["studioTeaser"] }) {
  return (
    <section className="section">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-7">
          <Reveal>
            <span className="eyebrow">Studio</span>
          </Reveal>
          <TextReveal as="h2" text={data.title} className="display-xl text-gradient" />
          <Reveal delay={0.1}>
            <p className="lead max-w-xl">{data.text}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <Button href={data.cta.href} variant="line">
              {data.cta.label}
            </Button>
          </Reveal>
        </div>

        {/* abstract visual */}
        <Reveal delay={0.1}>
          <Parallax distance={28}>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-bg-raised">
            <div className="absolute inset-0 grid-field opacity-70" />
            <div className="absolute inset-0 glow opacity-80" />
            <div className="absolute inset-[18%] rounded-full border border-line-strong" />
            <div className="absolute inset-[32%] rounded-full border border-accent/40" />
            <div className="absolute inset-[46%] rotate-45 border border-line-strong bg-bg-elevated/40 backdrop-blur-sm" />
            <span className="absolute bottom-6 left-6 font-mono text-xs uppercase tracking-[0.28em] text-ink-faint">
              Content · Technology · Space
            </span>
          </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
