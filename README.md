# CTRLstudio

Premium, immersive website for **CTRLstudio** — a creative-technology partner
for brands, events and spaces. Built around one idea: **content × technology ×
space**, connected into visual experiences that work in the real world.

> **Hero:** _Visual experiences powered by technology._
> Tworzymy doświadczenia wizualne dla marek, wydarzeń i przestrzeni.

---

## Stack

| Area            | Choice                                              |
| --------------- | --------------------------------------------------- |
| Framework       | **Next.js 16** (App Router) + **React 19** + TS     |
| Styling         | **Tailwind CSS v4** (CSS-first theme, dark-only)    |
| Smooth scroll   | **Lenis** (synced with GSAP ScrollTrigger)          |
| Animation       | **Motion** (`motion/react`) + **GSAP**              |
| 3D hero         | **Three.js** + **@react-three/fiber** + **drei**    |
| Content/CMS     | Local typed content now, **Sanity-ready** (see below) |
| Fonts           | Geist (body) · REFRIGERATOR (display, self-hosted)  |

Requires **Node ≥ 20.9** (developed on Node 24). Turbopack is the default
bundler in Next 16 — no flags needed.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (flat config)
```

---

## Project structure

```
src/
  app/                     # routes (App Router)
    page.tsx               # / — homepage (composes the sections)
    work/page.tsx          # /work — project grid
    work/[slug]/page.tsx   # /work/:slug — project detail (SSG)
    studio/page.tsx        # /studio
    contact/page.tsx       # /contact (+ actions.ts, ContactForm.tsx)
    polityka-prywatnosci/  # RODO/privacy template
    opengraph-image.tsx    # generated social image (PNG)
    sitemap.ts · robots.ts · not-found.tsx
  components/
    layout/                # Header, Footer, MobileMenu, Logo
    sections/              # Hero, Showreel, Services, Process, …
    ui/                    # Button, TextReveal, Reveal, ProjectCard, VideoPlayer…
    effects/               # HeroObject/HeroScene (3D), Cursor, MouseLight, Particles
    providers/             # SmoothScroll (Lenis), Loader
  content/                 # ← EDIT YOUR CONTENT HERE (site, homepage, projects, contact)
  lib/                     # content.ts (data layer), seo.ts, types.ts, utils.ts
sanity/                    # CMS schemas, ready to connect (excluded from build)
public/
  assets/                  # logo, showreel, poster, …
  fonts/Refrigerator/      # drop the REFRIGERATOR font here
```

---

## Editing content (no CMS required)

All copy and projects live in **`src/content/`** as typed files — change them
and the site updates instantly:

| Edit this file              | Controls                                        |
| --------------------------- | ----------------------------------------------- |
| `src/content/site.ts`       | Name, email, phone, socials, nav, default SEO   |
| `src/content/homepage.ts`   | Hero, brand sentences, showreel, services, process, CTAs |
| `src/content/projects.ts`   | The portfolio (see below)                       |
| `src/content/contact.ts`    | Contact copy, budget options, RODO consent text |

### Adding / editing a project

Add an entry to the array in `src/content/projects.ts`:

```ts
{
  title: "Nazwa realizacji",
  slug: "nazwa-realizacji",          // becomes /work/nazwa-realizacji
  category: "Event · Oprawa wizualna",
  client: "Klient",
  year: "2026",
  shortDescription: "Jedno–dwa zdania na kartę.",
  longDescription: "Akapit pierwszy.\n\nAkapit drugi.", // \n\n splits paragraphs
  thumbnail: "/assets/projects/nazwa.jpg",   // optional — gradient used if omitted
  hoverVideo: "/assets/projects/nazwa.mp4",  // optional hover preview
  video: "/assets/projects/nazwa-hero.mp4",  // optional video on the detail page
  services: ["Doświadczenia wizualne", "Scenografia cyfrowa"],
  accent: "#6b79ff",                 // drives the placeholder gradient + glow
  order: 6,
  featured: true,
}
```

### Project images & videos

Put media in `public/assets/...` and reference it by path
(e.g. `/assets/projects/foo.jpg`). Images go through `next/image`; videos are
lazy-loaded `<video>` elements. No image is needed to launch — a generated
gradient placeholder is used until you add one.

---

## Adding the REFRIGERATOR font

The studio's display font is wired via `@font-face` and self-hosted.

1. Put your licensed web-font file(s) in **`public/fonts/Refrigerator/`**:
   - `Refrigerator.woff2` (recommended) and/or `Refrigerator.woff`
2. That's it — headings upgrade automatically. Until a file is present, all
   headings fall back to Geist so nothing looks broken.
3. Different filename? Either rename it, or update the `url(...)` paths in the
   `@font-face` block in **`src/app/globals.css`**.

(Convert .otf/.ttf → .woff2 with the Fontsquirrel generator, if your licence
allows web embedding.)

## Adding the CTRLstudio logo

- A placeholder is at `public/assets/logo.svg`. Replace it with the real file
  (and optionally add `logo.png`).
- The header/footer currently render a **text wordmark** from
  `src/components/layout/Logo.tsx`. To use the SVG instead, swap the markup for
  `<Image src="/assets/logo.svg" alt="CTRLstudio" width={132} height={24} />`
  (instructions are in that file).

## Adding the showreel video

1. Drop **`public/assets/showreel.mp4`** (H.264 .mp4, ~1080p recommended).
2. Optionally replace `public/assets/showreel-poster.svg` with a real still
   frame (`.jpg`/`.png` looks best).
3. The player (play/pause, mute, fullscreen) is lazy-loaded and never
   autoplays. Change the path in `src/content/homepage.ts` if you rename it.

---

## Updating SEO metadata

- **Per page:** each route exports `metadata` via `buildMetadata({ title, description, path })` (`src/lib/seo.ts`). Edit those strings.
- **Site defaults & canonical host:** `src/content/site.ts` (`seo`, and `SITE_URL`).
- **Social image:** generated automatically as a PNG by `src/app/opengraph-image.tsx` — edit the JSX to restyle.
- **Canonical / sitemap / robots:** set `NEXT_PUBLIC_SITE_URL` in production; `sitemap.ts` and `robots.ts` pick it up.

---

## Connecting Sanity (optional)

The site reads content through `src/lib/content.ts`. The getters are already
**async**, so moving to Sanity is a drop-in — no component changes. Full
schemas (`siteSettings`, `homepage`, `service`, `project`, `mediaBlock`,
`contactPage`) are in **`/sanity`**. See **`sanity/README.md`** for the steps:
install packages, create a project, add env vars, mount the Studio, and replace
the getter bodies with GROQ queries.

---

## Contact form delivery

The form (`src/app/contact/`) validates on the server, enforces RODO consent,
and currently **logs** submissions. To receive emails, plug a provider into
`src/app/contact/actions.ts` (a Resend snippet is included as a comment) and set
`CONTACT_TO_EMAIL` / `RESEND_API_KEY` from `.env.example`.

> ⚠️ Before launch: complete `src/app/polityka-prywatnosci/page.tsx` with your
> real legal details (administrator, retention, etc.).

---

## Deployment (Vercel)

1. Push to GitHub:
   ```bash
   git add . && git commit -m "CTRLstudio website"
   git branch -M main
   git remote add origin git@github.com:<you>/ctrlstudio.git
   git push -u origin main
   ```
2. In **Vercel** → *New Project* → import the repo. Framework auto-detects as
   Next.js; no build config needed.
3. Add environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL=https://ctrlstudio.pl`
   - (later) Sanity / Resend vars from `.env.example`.
4. Deploy. You get a `*.vercel.app` URL to preview.

### Connecting the `ctrlstudio` domain (home.pl DNS)

1. In Vercel → Project → **Settings → Domains** → add `ctrlstudio.pl` **and**
   `www.ctrlstudio.pl`. Vercel shows the exact DNS records to create.
2. Log in to **home.pl** → DNS / strefa DNS for the domain. Typically:
   - **www** → `CNAME` to the target Vercel shows (e.g. `cname.vercel-dns.com`).
   - **apex / root (`@`)** → the `A` record IP **that Vercel provides**
     (or follow Vercel's recommended apex setup).
3. **Do not hardcode IPs from this README** — always use the values Vercel
   displays for your project, as they can change.
4. Wait for DNS propagation (minutes–hours). Vercel issues HTTPS automatically
   once records resolve. Set the preferred domain (redirect `www` → apex or
   vice-versa) in Vercel.

> Hosting elsewhere? Any Node host that runs `next build` + `next start` works;
> or use a Node-capable plan on home.pl and follow their Next.js guide.

---

## Notes on craft

- **Accessibility:** semantic landmarks, skip link, keyboard-focus rings, ARIA
  labels on media controls, and full `prefers-reduced-motion` support (3D,
  cursor, particles and reveals all degrade to static, readable content).
- **Performance:** the 3D hero is client-only, lazy-loaded, paused off-screen,
  and replaced by a light CSS/canvas fallback on mobile & reduced motion; video
  is lazy with `preload="none"`; pages are static/SSG.
- **i18n-ready:** Polish is the content language; copy is centralised in
  `src/content` so an English layer can be added later without touching components.
```
