import type { ContactPage } from "@/lib/types";
import { site } from "@/content/site";

export const contactPage: ContactPage = {
  title: "Porozmawiajmy o doświadczeniu",
  text: "Napisz, co chcesz osiągnąć i gdzie ma to zadziałać — scena, stoisko, targi, wystawa, showroom czy stała instalacja. Odezwiemy się i zaproponujemy kierunek.",
  email: site.email,
  phone: site.phone,
  location: site.location,
  socials: site.socials,
  budgets: [
    "Do 20 000 zł",
    "20 000 – 50 000 zł",
    "50 000 – 150 000 zł",
    "Powyżej 150 000 zł",
    "Jeszcze nie wiem",
  ],
  consent:
    "Wyrażam zgodę na przetwarzanie moich danych w celu odpowiedzi na zapytanie.",
  privacyNote:
    "Twoje dane wykorzystamy wyłącznie do kontaktu w sprawie tego zapytania. Nie przekazujemy ich dalej.",
};
