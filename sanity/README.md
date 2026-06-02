# Sanity schemas (ready to connect)

These are the content schemas for CTRLstudio, written for **Sanity v3**. They
are intentionally **kept out of the Next.js build** (`sanity` is listed in
`tsconfig.json` → `exclude`) so the site compiles without the Sanity packages
installed. The site currently reads typed local content from `src/content/*`
through `src/lib/content.ts`.

## Schemas

| Schema          | Type      | Purpose                                  |
| --------------- | --------- | ---------------------------------------- |
| `siteSettings`  | singleton | Nav, contact, socials, default SEO       |
| `homepage`      | singleton | All homepage copy + sections             |
| `contactPage`   | singleton | Contact copy, budgets, RODO consent      |
| `service`       | document  | The four service pillars                 |
| `project`       | document  | Portfolio items (full content model)     |
| `mediaBlock`    | object    | Reusable image/video block for bodies    |

## How to go live with Sanity

1. Install packages:
   ```bash
   npm install sanity next-sanity @sanity/image-url @sanity/vision styled-components
   ```
2. Create a free project at https://sanity.io and copy its **Project ID**.
3. Add to `.env.local` (see `.env.example`):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
4. Add a `sanity.config.ts` at the project root that imports `schemaTypes`
   from `./sanity/schemas` and mounts the Studio (e.g. at `/app/studio-cms`).
   Remove `"sanity"` from `tsconfig.json` → `exclude` so the schemas type-check.
5. Rewrite the getter bodies in `src/lib/content.ts` to fetch with GROQ — the
   return types already match, so **no component changes are needed**.
