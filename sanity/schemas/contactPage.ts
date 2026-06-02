import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Strona kontaktu",
  type: "document",
  // Singleton.
  fields: [
    defineField({ name: "title", title: "Tytuł", type: "string" }),
    defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
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
      name: "budgets",
      title: "Widełki budżetowe",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "consent", title: "Treść zgody (RODO)", type: "text", rows: 2 }),
    defineField({ name: "privacyNote", title: "Nota o prywatności", type: "text", rows: 2 }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "title", title: "Tytuł", type: "string" },
        { name: "description", title: "Opis", type: "text", rows: 3 },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Strona kontaktu" }) },
});
