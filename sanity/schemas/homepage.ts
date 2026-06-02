import { defineField, defineType } from "sanity";

const cta = {
  type: "object",
  fields: [
    { name: "label", title: "Etykieta", type: "string" },
    { name: "href", title: "Ścieżka", type: "string" },
  ],
};

export const homepage = defineType({
  name: "homepage",
  title: "Strona główna",
  type: "document",
  // Singleton.
  fields: [
    defineField({ name: "heroHeadline", title: "Hero — nagłówek (EN)", type: "string" }),
    defineField({
      name: "heroSubtext",
      title: "Hero — tekst (PL)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "heroCtas",
      title: "Hero — przyciski",
      type: "array",
      of: [cta],
    }),
    defineField({
      name: "brand",
      title: "Zdanie marki",
      type: "object",
      fields: [
        { name: "sentence", title: "Główne zdanie", type: "text", rows: 2 },
        { name: "supporting", title: "Zdanie wspierające", type: "text", rows: 3 },
      ],
    }),
    defineField({
      name: "showreel",
      title: "Showreel",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 2 },
        { name: "video", title: "Wideo", type: "file", options: { accept: "video/*" } },
        { name: "poster", title: "Poster", type: "image" },
      ],
    }),
    defineField({
      name: "services",
      title: "Usługi",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "technology",
      title: "Technologia (wsparcie)",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 3 },
        {
          name: "tags",
          title: "Tagi",
          type: "array",
          of: [{ type: "string" }],
          options: { layout: "tags" },
        },
      ],
    }),
    defineField({
      name: "process",
      title: "Proces",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 3 },
        {
          name: "steps",
          title: "Kroki",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "index", title: "Numer", type: "string" },
                { name: "title", title: "Tytuł", type: "string" },
                { name: "description", title: "Opis", type: "text", rows: 2 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: "selectedWork",
      title: "Wybrane realizacje (nagłówek)",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 2 },
      ],
    }),
    defineField({
      name: "studioTeaser",
      title: "Studio (teaser)",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 3 },
        { name: "cta", title: "Przycisk", ...cta },
      ],
    }),
    defineField({
      name: "contactCta",
      title: "Kontakt (CTA)",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "text", title: "Tekst", type: "text", rows: 2 },
        { name: "cta", title: "Przycisk", ...cta },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "description", title: "Opis", type: "text", rows: 3 },
        { name: "ogImage", title: "Obraz OG", type: "image" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Strona główna" }) },
});
