import type { SiteSettings } from "@/lib/types";

/** Public site URL — override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ctrlstudio.pl";

export const site: SiteSettings = {
  name: "CTRLstudio",
  shortName: "CTRL",
  url: SITE_URL,
  // Placeholders — replace with real studio contact details.
  email: "hello@ctrlstudio.pl",
  phone: "+48 000 000 000",
  location: "Polska",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Vimeo", href: "https://vimeo.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Behance", href: "https://behance.net/" },
  ],
  nav: [
    { label: "Work", href: "/work" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ],
  seo: {
    title: "CTRLstudio — Visual Experiences Powered by Technology",
    description:
      "CTRLstudio tworzy doświadczenia wizualne dla marek, wydarzeń i przestrzeni. Łączymy content, technologię i przestrzeń w projekty dla eventów, targów, ekspozycji i stałych instalacji.",
    ogImage: "/assets/og-image.svg",
  },
};
