import { defineField, defineType } from "sanity";

/**
 * Reusable media block — embed an image or video with an optional caption
 * inside rich-text bodies (e.g. project long descriptions).
 */
export const mediaBlock = defineType({
  name: "mediaBlock",
  title: "Blok medialny",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Typ",
      type: "string",
      options: {
        list: [
          { title: "Obraz", value: "image" },
          { title: "Wideo", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
    }),
    defineField({
      name: "image",
      title: "Obraz",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== "image",
    }),
    defineField({
      name: "video",
      title: "Wideo",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.type !== "video",
    }),
    defineField({ name: "caption", title: "Podpis", type: "string" }),
    defineField({
      name: "aspect",
      title: "Proporcje",
      type: "string",
      options: {
        list: ["16:9", "4:3", "1:1", "21:9"],
      },
      initialValue: "16:9",
    }),
  ],
  preview: { select: { title: "caption", media: "image" } },
});
