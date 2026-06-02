import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { placeholderGradient } from "@/lib/utils";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Realizacja", path: `/work/${slug}` });
  return buildMetadata({
    title: project.seo?.title ?? project.title,
    description: project.seo?.description ?? project.shortDescription,
    path: `/work/${slug}`,
    image: project.thumbnail,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(slug);
  const paragraphs = project.longDescription?.split("\n\n") ?? [];

  return (
    <article>
      {/* header */}
      <section className="pb-10 pt-[calc(var(--header-h)+clamp(2.5rem,7vh,5rem))]">
        <div className="container-x flex flex-col gap-8">
          <Reveal>
            <Link
              href="/work"
              data-cursor
              className="group inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Wszystkie realizacje
            </Link>
          </Reveal>
          <div className="flex flex-col gap-5">
            <span className="eyebrow">{project.category}</span>
            <TextReveal
              as="h1"
              text={project.title}
              className="display-xl text-gradient max-w-[18ch]"
            />
            <Reveal delay={0.1}>
              <p className="lead max-w-2xl">{project.shortDescription}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* hero media */}
      <div className="container-x">
        <Reveal>
          {project.video ? (
            <VideoPlayer src={project.video} poster={project.thumbnail} label={project.title} />
          ) : (
            <div
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line"
              style={{ background: placeholderGradient(project.accent) }}
            >
              <div className="absolute inset-0 grid-field opacity-50" />
              <span
                aria-hidden
                className="absolute bottom-4 left-6 font-display text-[12vw] leading-none text-white/[0.05]"
              >
                {project.category.split(" ")[0]}
              </span>
            </div>
          )}
        </Reveal>
      </div>

      {/* body */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="text-lg leading-relaxed text-ink-dim">{p}</p>
              </Reveal>
            ))}
          </div>

          <aside className="flex flex-col gap-8 lg:border-l lg:border-line lg:pl-10">
            <MetaBlock label="Klient" value={project.client} />
            <MetaBlock label="Rok" value={project.year} />
            {project.services && project.services.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Zakres</span>
                <ul className="flex flex-wrap gap-2">
                  {project.services.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-dim"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* gallery */}
      <section className="section pt-0">
        <div className="container-x flex flex-col gap-8">
          <span className="eyebrow">Galeria</span>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Reveal key={i} delay={(i % 2) * 0.08}>
                <div
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line"
                  style={{ background: placeholderGradient(project.accent) }}
                >
                  <div className="absolute inset-0 grid-field opacity-40" />
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-sm text-ink-faint">
            Miejsce na zdjęcia i materiały z realizacji — dodasz je w CMS.
          </p>
        </div>
      </section>

      {/* prev / next */}
      <section className="border-t border-line py-12">
        <div className="container-x grid gap-6 sm:grid-cols-2">
          <ProjectNav project={prev} direction="prev" />
          <ProjectNav project={next} direction="next" />
        </div>
      </section>
    </article>
  );
}

function MetaBlock({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="eyebrow">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

function ProjectNav({
  project,
  direction,
}: {
  project: Project | null;
  direction: "prev" | "next";
}) {
  if (!project) return <div className="hidden sm:block" />;
  const isNext = direction === "next";
  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor
      className={`group flex flex-col gap-2 rounded-2xl border border-line p-6 transition-colors hover:border-line-strong ${
        isNext ? "sm:items-end sm:text-right" : ""
      }`}
    >
      <span className="eyebrow">{isNext ? "Następny projekt" : "Poprzedni projekt"}</span>
      <span className="display-lg text-ink transition-colors group-hover:text-accent-ink">
        {project.title}
      </span>
    </Link>
  );
}
