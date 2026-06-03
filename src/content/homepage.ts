import type { Homepage } from "@/lib/types";

export const homepage: Homepage = {
  heroHeadline: "Visual experiences powered by technology",
  heroSubtext:
    "Doświadczenia wizualne dla marek, wydarzeń i przestrzeni. Łączymy content, technologię i przestrzeń.",
  heroCtas: [
    { label: "Zobacz, co robimy", href: "/work" },
    { label: "Zobacz showreel", href: "#showreel" },
  ],

  brand: {
    sentence:
      "CTRLstudio to partner kreatywno-technologiczny dla marek, eventów i przestrzeni.",
    supporting:
      "Projektujemy i realizujemy rozwiązania wizualne, które łączą content, technologię i przestrzeń. Pomagamy tworzyć doświadczenia, które działają w realnych warunkach — na scenie, stoisku, targach, wystawie, w showroomie albo stałej instalacji.",
  },

  showreel: {
    title: "Showreel",
    text: "Zobacz, jak obraz, ruch i technologia pracują razem w przestrzeni.",
    src: "/assets/showreel.mp4",
    poster: "/assets/showreel-poster.svg",
    vimeoId: "358824206",
  },

  services: [
    {
      id: "experiences",
      index: "01",
      title: "Doświadczenia wizualne",
      scope: "Marki · eventy · ekspozycje · showroomy · przestrzenie",
      description:
        "Tworzymy projekty, w których obraz, dźwięk, ruch i przestrzeń budują atmosferę oraz angażują odbiorcę.",
      visual: "experience",
    },
    {
      id: "scenography",
      index: "02",
      title: "Scenografia cyfrowa",
      scope: "Sceny · stoiska · ekspozycje · stałe przestrzenie",
      description:
        "Projektujemy cyfrową oprawę wydarzeń, scen, stoisk, ekspozycji i stałych przestrzeni — tak, aby miejsce miało własny klimat, rytm i spójną warstwę wizualną.",
      visual: "scenography",
    },
    {
      id: "interactive",
      index: "03",
      title: "Instalacje interaktywne",
      scope: "Ruch · dotyk · dźwięk · dane · otoczenie",
      description:
        "Budujemy instalacje, które reagują na człowieka, ruch, dotyk, dźwięk, dane albo otoczenie.",
      visual: "interactive",
    },
    {
      id: "product",
      index: "04",
      title: "Prezentacje i doświadczenia produktowe",
      scope: "Produkt · usługa · technologia · idea",
      description:
        "Tworzymy animacje, prezentacje 3D i angażujące formy wizualne, które pomagają pokazać produkt, usługę, technologię albo ideę.",
      visual: "product",
    },
  ],

  technology: {
    title: "Technologia jest po to, żeby działać",
    text: "Technologię dobieramy do doświadczenia — projektujemy, produkujemy, testujemy i wdrażamy na miejscu.",
    tags: [
      "content",
      "ruch",
      "interakcja",
      "ekrany",
      "projekcja",
      "dźwięk",
      "sensory",
      "3D",
      "wdrożenie",
    ],
  },

  process: {
    title: "Od koncepcji po wdrożenie",
    text: "Od pierwszego pomysłu po działające rozwiązanie w przestrzeni.",
    steps: [
      {
        index: "01",
        title: "Koncepcja",
        description:
          "Rozumiemy cel, miejsce i odbiorcę. Ustalamy ideę doświadczenia.",
      },
      {
        index: "02",
        title: "Projekt",
        description:
          "Projektujemy warstwę wizualną, ruch i sposób działania w przestrzeni.",
      },
      {
        index: "03",
        title: "Produkcja",
        description:
          "Tworzymy content, animacje, sceny i systemy — gotowe do uruchomienia.",
      },
      {
        index: "04",
        title: "Testy",
        description:
          "Sprawdzamy całość w realnych warunkach, zanim wejdzie na żywo.",
      },
      {
        index: "05",
        title: "Wdrożenie",
        description:
          "Uruchamiamy i wspieramy realizację na miejscu — na scenie, targach, wystawie.",
      },
    ],
  },

  selectedWork: {
    title: "Wybrane realizacje",
    text: "Oprawy eventów, instalacje, prezentacje produktowe i doświadczenia wizualne dla przestrzeni.",
  },

  studioTeaser: {
    title: "Studio",
    text: "CTRLstudio działa na styku obrazu, technologii i przestrzeni — łączymy kreację z technicznym wdrożeniem.",
    cta: { label: "Poznaj studio", href: "/studio" },
  },

  contactCta: {
    title: "Masz projekt, który ma wyjść poza ekran?",
    text: "Porozmawiajmy o doświadczeniu, które można zobaczyć, uruchomić i przeżyć w realnej przestrzeni.",
    cta: { label: "Napisz do nas", href: "/contact" },
  },
};
