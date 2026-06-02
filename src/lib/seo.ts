import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

interface BuildMetaArgs {
  title?: string;
  description?: string;
  /** Path beginning with "/" — used for canonical + OG url. */
  path?: string;
  image?: string;
  /** When true, the title is used verbatim (no "— CTRLstudio" suffix). */
  absoluteTitle?: boolean;
}

/**
 * Central metadata builder so every page ships consistent canonical,
 * OpenGraph and Twitter tags. CMS SEO fields plug straight in here later.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  absoluteTitle = false,
}: BuildMetaArgs = {}): Metadata {
  const resolvedTitle = title
    ? absoluteTitle
      ? title
      : `${title} — ${site.name}`
    : site.seo.title;
  const resolvedDescription = description || site.seo.description;
  const url = `${SITE_URL}${path === "/" ? "" : path}`;

  // When no explicit image is given, omit it so Next uses the file-based
  // `opengraph-image` (a real generated PNG) automatically.
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: site.name }]
    : undefined;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      locale: "pl_PL",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      ...(images ? { images } : {}),
    },
  };
}
