import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Realizacje CTRLstudio — oprawy eventów, instalacje interaktywne, prezentacje produktowe, scenografie cyfrowe i doświadczenia wizualne dla przestrzeni.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        eyebrow="Realizacje"
        title="Wybrane realizacje"
        intro="Oprawy eventów, instalacje, prezentacje produktowe, ekspozycje i doświadczenia wizualne — projekty, które łączą content, technologię i przestrzeń."
      />

      <section className="section pt-4">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 2) * 0.08}>
              <ProjectCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
