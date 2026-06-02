import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Realizacja",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", title: "Kategoria", type: "string" }),
    defineField({ name: "client", title: "Klient", type: "string" }),
    defineField({ name: "year", title: "Rok", type: "string" }),
    defineField({
      name: "shortDescription",
      title: "Krótki opis",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "longDescription",
      title: "Pełny opis",
      type: "array",
      of: [{ type: "block" }, { type: "mediaBlock" }],
    }),
    defineField({
      name: "thumbnail",
      title: "Miniatura",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "hoverVideo",
      title: "Wideo na hover (podgląd)",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "video",
      title: "Wideo (strona projektu)",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "gallery",
      title: "Galeria",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "services",
      title: "Użyte usługi",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({ name: "accent", title: "Kolor akcentu (hex)", type: "string" }),
    defineField({ name: "order", title: "Kolejność", type: "number" }),
    defineField({ name: "featured", title: "Wyróżniony", type: "boolean" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł SEO", type: "string" },
        { name: "description", title: "Opis SEO", type: "text", rows: 3 },
      ],
    }),
  ],
  orderings: [
    { name: "order", title: "Kolejność", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "thumbnail" } },
});
