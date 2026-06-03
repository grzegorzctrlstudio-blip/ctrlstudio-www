/**
 * Content model for CTRLstudio.
 *
 * These types are the single contract the UI reads against. Today the data
 * comes from local files in `src/content`; when Sanity is connected, only
 * `src/lib/content.ts` changes — the components stay identical.
 */

export type Locale = "pl" | "en";

export interface Cta {
  label: string;
  href: string;
}

export interface Social {
  label: string;
  href: string;
}

export interface Seo {
  title: string;
  description: string;
  ogImage?: string;
}

export interface SiteSettings {
  name: string;
  shortName: string;
  url: string;
  email: string;
  phone: string;
  location?: string;
  socials: Social[];
  nav: Cta[];
  seo: Seo;
}

/** Visual key lets each service render a distinct background treatment. */
export type ServiceVisual =
  | "experience"
  | "scenography"
  | "interactive"
  | "product";

export interface Service {
  id: string;
  index: string; // "01"
  title: string;
  scope: string; // short, distinguishing line
  description: string;
  visual: ServiceVisual;
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
}

export interface Project {
  title: string;
  slug: string;
  category: string;
  client?: string;
  year?: string;
  shortDescription: string;
  longDescription?: string;
  thumbnail?: string; // image path; when absent a generated gradient is used
  hoverVideo?: string; // optional animated preview on hover
  video?: string; // optional embedded/local video on the detail page
  gallery?: string[];
  services?: string[];
  accent: string; // hex — drives the placeholder gradient + card glow
  order: number;
  featured?: boolean;
  seo?: Partial<Seo>;
}

export interface Homepage {
  heroHeadline: string; // EN — the brand statement
  heroSubtext: string; // PL
  heroCtas: Cta[];
  brand: { sentence: string; supporting: string };
  showreel: {
    title: string;
    text: string;
    src?: string;
    poster?: string;
    vimeoId?: string;
  };
  services: Service[];
  technology: { title: string; text: string; tags: string[] };
  process: { title: string; text: string; steps: ProcessStep[] };
  selectedWork: { title: string; text: string };
  studioTeaser: { title: string; text: string; cta: Cta };
  contactCta: { title: string; text: string; cta: Cta };
}

export interface ContactPage {
  title: string;
  text: string;
  email: string;
  phone: string;
  location?: string;
  socials: Social[];
  budgets: string[];
  consent: string;
  privacyNote: string;
}
