import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { WorkGalleryView } from "@/components/effects/WorkGalleryView";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Realizacje CTRLstudio — oprawy eventów, instalacje interaktywne, prezentacje produktowe, scenografie cyfrowe i doświadczenia wizualne dla przestrzeni.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  const items = projects
    .filter((p) => p.thumbnail)
    .map((p) => ({
      slug: p.slug,
      thumbnail: p.thumbnail as string,
      title: p.title,
    }));

  return <WorkGalleryView items={items} />;
}
