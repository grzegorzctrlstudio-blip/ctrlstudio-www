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
      id: "content",
      index: "01",
      title: "Content wizualny i animacje",
      description:
        "Tworzymy animacje, oprawy graficzne i content ekranowy dla eventów, gal, konferencji, stoisk targowych, wystaw i przestrzeni interaktywnych. Projektujemy materiały pod konkretne ekrany, sceny i formaty — tak, żeby obraz budował klimat, prowadził uwagę i działał w realnej przestrzeni.",
      tags: [
        "Animacje 2D/3D",
        "Motion design",
        "Intro i loopy",
        "Tła sceniczne",
        "Content na LED-y",
        "Prezentacje produktowe",
        "Oprawa stoisk",
        "Materiały na wystawy",
      ],
      visual: "experience",
    },
    {
      id: "interactive",
      index: "02",
      title: "Aplikacje i systemy interaktywne",
      description:
        "Projektujemy rozwiązania, które pozwalają odbiorcy wejść w interakcję z marką, produktem albo przestrzenią. Tworzymy aplikacje interaktywne, awatary, prezentacje realtime, systemy sterowania treścią i narzędzia do obsługi ekspozycji, eventów oraz instalacji.",
      tags: [
        "Aplikacje dotykowe",
        "Interaktywne prezentacje",
        "Awatary",
        "Systemy zarządzania contentem",
        "Instalacje reagujące na użytkownika",
        "Unreal / Unity",
        "Realtime 3D",
        "Obsługa ekspozycji",
      ],
      visual: "interactive",
    },
    {
      id: "multimedia",
      index: "03",
      title: "Obsługa systemów multimedialnych",
      description:
        "Wspieramy realizacje technicznie na miejscu — od przygotowania contentu po jego uruchomienie i obsługę na serwerach multimedialnych. Pracujemy z systemami takimi jak Disguise, Watchout, Resolume Arena i podobnymi rozwiązaniami wykorzystywanymi przy eventach, scenach, mappingach, stoiskach i instalacjach.",
      tags: [
        "Disguise",
        "Watchout",
        "Resolume Arena",
        "Playback",
        "Mapping",
        "Synchronizacja ekranów",
        "Testy contentu",
        "Przygotowanie plików pod emisję",
        "Wsparcie podczas wydarzenia",
      ],
      visual: "scenography",
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
