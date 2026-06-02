import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "404",
  description: "Nie znaleziono strony.",
  path: "/404",
});

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 glow opacity-60" aria-hidden />
      <div className="absolute inset-0 grid-field opacity-30" aria-hidden />
      <p className="eyebrow relative mb-6">Błąd 404</p>
      <h1 className="display-hero text-gradient relative">404</h1>
      <p className="lead relative mt-6 max-w-md">
        Ta strona wyszła poza ekran. Wróćmy do tego, co można zobaczyć i przeżyć.
      </p>
      <div className="relative mt-10">
        <Button href="/" variant="solid">
          Wróć na stronę główną
        </Button>
      </div>
    </section>
  );
}
