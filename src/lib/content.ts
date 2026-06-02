/**
 * Data-access layer — the ONLY place the rest of the app asks for content.
 *
 * Right now every getter returns local, typed data from `src/content`.
 * The getters are async on purpose: when you connect Sanity, you only rewrite
 * the bodies here (e.g. `return sanityClient.fetch(...)`) and nothing in the
 * pages or components has to change. See README → "Connecting Sanity".
 */
import { site } from "@/content/site";
import { homepage } from "@/content/homepage";
import { projects } from "@/content/projects";
import { contactPage } from "@/content/contact";
import type { Project } from "@/lib/types";

export async function getSiteSettings() {
  return site;
}

export async function getHomepage() {
  return homepage;
}

export async function getServices() {
  return homepage.services;
}

export async function getProjects(): Promise<Project[]> {
  return [...projects].sort((a, b) => a.order - b.order);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getProjects()).filter((p) => p.featured);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  return projects.map((p) => p.slug);
}

/** Previous / next project for detail-page navigation (wraps around). */
export async function getAdjacentProjects(slug: string): Promise<{
  prev: Project | null;
  next: Project | null;
}> {
  const ordered = await getProjects();
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  const prev = ordered[(i - 1 + ordered.length) % ordered.length] ?? null;
  const next = ordered[(i + 1) % ordered.length] ?? null;
  return { prev, next };
}

export async function getContactPage() {
  return contactPage;
}
