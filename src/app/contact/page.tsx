import type { Metadata } from "next";
import { getContactPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/app/contact/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Porozmawiajmy o doświadczeniu, które można zobaczyć, uruchomić i przeżyć w realnej przestrzeni. Napisz do CTRLstudio.",
  path: "/contact",
});

export default async function ContactPage() {
  const c = await getContactPage();

  return (
    <>
      <PageIntro eyebrow="Kontakt" title={c.title} intro={c.text} />

      <section className="section pt-4">
        <div className="container-x grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <Reveal>
            <ContactForm budgets={c.budgets} consent={c.consent} />
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="eyebrow">E-mail</span>
                <a
                  href={`mailto:${c.email}`}
                  data-cursor
                  className="text-lg text-ink transition-colors hover:text-accent-ink"
                >
                  {c.email}
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="eyebrow">Telefon</span>
                <a
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  data-cursor
                  className="text-lg text-ink transition-colors hover:text-accent-ink"
                >
                  {c.phone}
                </a>
              </div>
              {c.location && (
                <div className="flex flex-col gap-2">
                  <span className="eyebrow">Lokalizacja</span>
                  <span className="text-lg text-ink">{c.location}</span>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <span className="eyebrow">Social</span>
                <div className="flex flex-wrap gap-4">
                  {c.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor
                      className="text-ink-dim transition-colors hover:text-ink"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-2 border-t border-line pt-6 text-sm leading-relaxed text-ink-faint">
                {c.privacyNote}
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
