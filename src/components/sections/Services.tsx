import type { Service, ServiceVisual } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/effects/Parallax";
import { ServiceIcon } from "@/components/sections/ServiceIcon";

const ICON: Record<ServiceVisual, string> = {
  experience: "/assets/icons/experiences.png",
  scenography: "/assets/icons/scenography.png",
  interactive: "/assets/icons/interactive.png",
  product: "/assets/icons/product.png",
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section className="section">
      <div className="container-x flex flex-col gap-16">
        <SectionHeading
          eyebrow="Co robimy"
          title="Cztery filary CTRLstudio"
          intro="Cztery sposoby, w jakie łączymy content, technologię i przestrzeń — każdy z osobnym zadaniem i własnym charakterem."
        />

        <div className="flex flex-col gap-20 lg:gap-28">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ service, flip }: { service: Service; flip: boolean }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(flip && "lg:order-2")}>
        <div className="flex flex-col gap-5">
          <span className="font-display text-6xl text-ink/10 sm:text-7xl">
            {service.index}
          </span>
          <h3 className="display-lg text-ink">{service.title}</h3>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-ink">
            {service.scope}
          </p>
          <p className="max-w-xl text-base leading-relaxed text-ink-dim">
            {service.description}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className={cn(flip && "lg:order-1")}>
        <Parallax distance={26}>
          <ServiceIcon src={ICON[service.visual]} alt={service.title} />
        </Parallax>
      </Reveal>
    </div>
  );
}
