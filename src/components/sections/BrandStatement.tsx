import type { Homepage } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

export function BrandStatement({ data }: { data: Homepage["brand"] }) {
  return (
    <section className="section">
      <div className="container-x grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <TextReveal
          as="p"
          text={data.sentence}
          className="display-lg text-gradient max-w-[18ch]"
        />
        <Reveal delay={0.1} className="flex items-end">
          <p className="lead max-w-xl">{data.supporting}</p>
        </Reveal>
      </div>
    </section>
  );
}
