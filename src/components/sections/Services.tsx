import type { Service, ServiceVisual } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/effects/Parallax";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { MouseLight } from "@/components/effects/MouseLight";

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
          <ServiceVisualBlock visual={service.visual} />
        </Parallax>
      </Reveal>
    </div>
  );
}

/** Each service gets a deliberately distinct visual treatment. */
function ServiceVisualBlock({ visual }: { visual: ServiceVisual }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-bg-raised">
      {visual === "experience" && (
        <>
          <ParticleBackground density={0.7} />
          <div className="absolute inset-0 glow opacity-80" />
          <div className="absolute inset-0 grid-field opacity-30" />
        </>
      )}

      {visual === "scenography" && (
        <>
          <div className="absolute inset-0 [perspective:1100px]">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className="absolute border border-line-strong bg-gradient-to-br from-accent/12 to-transparent"
                style={{
                  inset: `${14 + n * 6}% ${20 + n * 8}%`,
                  transform: `rotateY(-24deg) translateZ(${n * 30}px)`,
                }}
              />
            ))}
          </div>
          {/* stage floor + light */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 grid-field opacity-40 [mask-image:linear-gradient(to_top,#000,transparent)]" />
          <div className="absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        </>
      )}

      {visual === "interactive" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--line-strong) 1.2px, transparent 1.6px)",
              backgroundSize: "22px 22px",
            }}
          />
          <MouseLight size="18rem" intensity={0.4} />
          <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,#000,transparent_75%)]" />
        </>
      )}

      {visual === "product" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="absolute inset-0 glow opacity-70" />
          <div className="relative h-3/5 w-3/5">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-line-strong" />
            <div className="absolute inset-[14%] animate-spin-slow-rev rounded-full border border-accent/40" />
            <div className="absolute inset-[30%] rotate-45 animate-spin-slow border border-line-strong bg-bg-elevated/50 backdrop-blur-sm" />
            <div className="absolute inset-[42%] rounded-full bg-accent/30 blur-md" />
          </div>
        </div>
      )}
    </div>
  );
}
