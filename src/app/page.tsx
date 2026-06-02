import type { Metadata } from "next";
import { getHomepage, getProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { Showreel } from "@/components/sections/Showreel";
import { Services } from "@/components/sections/Services";
import { TechnologyLayer } from "@/components/sections/TechnologyLayer";
import { Process } from "@/components/sections/Process";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { StudioTeaser } from "@/components/sections/StudioTeaser";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default async function Home() {
  const home = await getHomepage();
  const projects = await getProjects();

  return (
    <>
      <Hero
        headline={home.heroHeadline}
        subtext={home.heroSubtext}
        ctas={home.heroCtas}
      />
      <BrandStatement data={home.brand} />
      <Showreel data={home.showreel} />
      <Services services={home.services} />
      <TechnologyLayer data={home.technology} />
      <Process data={home.process} />
      <SelectedWork data={home.selectedWork} projects={projects} />
      <StudioTeaser data={home.studioTeaser} />
      <ContactCTA data={home.contactCta} />
    </>
  );
}
