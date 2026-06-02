import type { Homepage } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { Button } from "@/components/ui/Button";
import { MouseLight } from "@/components/effects/MouseLight";

export function ContactCTA({ data }: { data: Homepage["contactCta"] }) {
  return (
    <section className="section relative overflow-hidden border-t border-line">
      <MouseLight size="46rem" intensity={0.2} />
      <div className="absolute inset-0 grid-field opacity-40" aria-hidden />

      <div className="container-x relative flex flex-col items-center gap-10 text-center">
        <TextReveal
          as="h2"
          text={data.title}
          className="display-xl text-gradient max-w-[20ch]"
        />
        <Reveal delay={0.1}>
          <p className="lead mx-auto max-w-2xl">{data.text}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <Button href={data.cta.href} variant="solid">
            {data.cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
