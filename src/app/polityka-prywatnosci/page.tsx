import type { Metadata } from "next";
import { site } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata: Metadata = buildMetadata({
  title: "Polityka prywatności",
  description: "Informacja o przetwarzaniu danych osobowych w CTRLstudio.",
  path: "/polityka-prywatnosci",
});

/**
 * RODO/GDPR template — fill in with your real legal details before launch
 * (administrator's full name/company, address, NIP, retention periods, etc.).
 */
export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Dokumenty"
        title="Polityka prywatności"
        intro="Poniżej znajdziesz informacje o tym, jak przetwarzamy dane osobowe przekazane przez formularz kontaktowy."
      />

      <section className="section pt-4">
        <div className="container-x flex max-w-3xl flex-col gap-8 text-ink-dim">
          <p className="rounded-lg border border-line bg-bg-raised p-4 text-sm text-ink-faint">
            To szablon do uzupełnienia. Przed publikacją uzupełnij dane
            administratora i szczegóły zgodne ze stanem faktycznym.
          </p>

          <Block title="Administrator danych">
            Administratorem danych jest {site.name}. W sprawach dotyczących
            danych osobowych skontaktuj się pod adresem{" "}
            <a href={`mailto:${site.email}`} className="text-ink hover:text-accent-ink">
              {site.email}
            </a>
            .
          </Block>

          <Block title="Jakie dane przetwarzamy">
            Dane przekazane w formularzu kontaktowym: imię i nazwisko, adres
            e-mail, opcjonalnie numer telefonu oraz treść wiadomości.
          </Block>

          <Block title="Cel i podstawa przetwarzania">
            Dane przetwarzamy wyłącznie w celu odpowiedzi na zapytanie i
            ewentualnej dalszej korespondencji (art. 6 ust. 1 lit. a oraz f
            RODO).
          </Block>

          <Block title="Okres przechowywania">
            Dane przechowujemy przez czas niezbędny do obsługi zapytania, a
            następnie do czasu przedawnienia ewentualnych roszczeń.
          </Block>

          <Block title="Twoje prawa">
            Masz prawo dostępu do danych, ich sprostowania, usunięcia,
            ograniczenia przetwarzania, wniesienia sprzeciwu oraz cofnięcia
            zgody w dowolnym momencie, a także prawo wniesienia skargi do
            Prezesa UODO.
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-display text-xl uppercase text-ink">{title}</h2>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
