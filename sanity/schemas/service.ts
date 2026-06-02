import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Usługa",
  type: "document",
  fields: [
    defineField({ name: "index", title: "Numer (np. 01)", type: "string" }),
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "scope", title: "Zakres (krótka linia)", type: "string" }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "visual",
      title: "Typ wizualizacji",
      type: "string",
      options: {
        list: [
          { title: "Doświadczenie / pole światła", value: "experience" },
          { title: "Scenografia / scena", value: "scenography" },
          { title: "Interakcja / reaktywne punkty", value: "interactive" },
          { title: "Produkt / obracająca się forma", value: "product" },
        ],
        layout: "radio",
      },
    }),
    defineField({ name: "order", title: "Kolejność", type: "number" }),
  ],
  orderings: [
    { name: "order", title: "Kolejność", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "title", subtitle: "scope" } },
});
