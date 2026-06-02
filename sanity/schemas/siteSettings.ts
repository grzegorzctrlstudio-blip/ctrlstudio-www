import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ustawienia serwisu",
  type: "document",
  // Singleton — create exactly one document of this type.
  fields: [
    defineField({ name: "name", title: "Nazwa", type: "string" }),
    defineField({ name: "shortName", title: "Skrót", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "location", title: "Lokalizacja", type: "string" }),
    defineField({
      name: "socials",
      title: "Social media",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Nazwa", type: "string" },
            { name: "href", title: "Link", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "nav",
      title: "Nawigacja",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Etykieta", type: "string" },
            { name: "href", title: "Ścieżka", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO (domyślne)",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "description", title: "Opis", type: "text", rows: 3 },
        { name: "ogImage", title: "Obraz OG", type: "image" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Ustawienia serwisu" }) },
});
