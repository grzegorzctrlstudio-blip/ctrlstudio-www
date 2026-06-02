import type { Homepage, Project } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ui/ProjectCard";

interface SelectedWorkProps {
  data: Homepage["selectedWork"];
  projects: Project[];
}

export function SelectedWork({ data, projects }: SelectedWorkProps) {
  return (
    <section className="section">
      <div className="container-x flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Wybrane realizacje" title={data.title} intro={data.text} />
          <Reveal className="hidden shrink-0 md:block">
            <Button href="/work" variant="line">
              Wszystkie realizacje
            </Button>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>

        <Reveal className="md:hidden">
          <Button href="/work" variant="line">
            Wszystkie realizacje
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
