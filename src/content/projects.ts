import type { Project } from "@/lib/types";

/**
 * Placeholder portfolio. These are demonstration entries — no real client
 * names or logos. Replace via CMS (or edit here) once real work is ready.
 * Each project renders a generated gradient until a `thumbnail` is provided.
 */
export const projects: Project[] = [
  {
    title: "Identyfikacja wizualna eventu",
    slug: "identyfikacja-wizualna-eventu",
    thumbnail: "/assets/work/identyfikacja-wizualna-eventu.webp",
    category: "Event · Oprawa wizualna",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Spójna oprawa wizualna wydarzenia — od openera, przez tła sceniczne, po animowane przejścia.",
    longDescription:
      "Kompletna warstwa wizualna wydarzenia zaprojektowana wokół jednego pomysłu: rytmu, który prowadzi widza przez cały program. Stworzyliśmy opener, tła sceniczne, animowane przejścia i grafikę ekranową, tak aby scena, światło i obraz grały razem.\n\nCałość przygotowaliśmy z myślą o realnej scenie — formatach ekranów, tempie prowadzenia i warunkach na żywo — i wspieraliśmy realizację na miejscu.",
    services: ["Doświadczenia wizualne", "Scenografia cyfrowa"],
    accent: "#6b79ff",
    order: 1,
    featured: true,
  },
  {
    title: "Interaktywna prezentacja produktu",
    slug: "interaktywna-prezentacja-produktu",
    thumbnail: "/assets/work/interaktywna-prezentacja-produktu.webp",
    category: "Produkt · Interakcja",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Prezentacja produktu, która reaguje na odbiorcę i pozwala poznać go z każdej strony.",
    longDescription:
      "Doświadczenie produktowe, w którym odbiorca sam prowadzi opowieść. Obraz reaguje na obecność i gest, a kolejne warstwy produktu odsłaniają się płynnie — od formy, przez detale, po sposób działania.\n\nPołączyliśmy animację 3D z warstwą interaktywną, żeby prezentacja angażowała i była zapamiętywana, a nie tylko oglądana.",
    services: [
      "Prezentacje i doświadczenia produktowe",
      "Instalacje interaktywne",
    ],
    accent: "#b06bff",
    order: 2,
    featured: true,
  },
  {
    title: "Stała instalacja multimedialna",
    slug: "stala-instalacja-multimedialna",
    thumbnail: "/assets/work/stala-instalacja-multimedialna.webp",
    category: "Instalacja · Przestrzeń stała",
    client: "Projekt demonstracyjny",
    year: "2024",
    shortDescription:
      "Multimedialna instalacja zaprojektowana do codziennej pracy w stałej przestrzeni.",
    longDescription:
      "Instalacja pomyślana jako trwały element miejsca — ma działać każdego dnia, niezawodnie i bez obsługi. Zaprojektowaliśmy obraz, ruch i sposób reakcji tak, aby przestrzeń żyła, ale nie męczyła.\n\nDobraliśmy technologię pod warunki miejsca i przygotowaliśmy realizację do długiej, stabilnej pracy.",
    services: ["Instalacje interaktywne", "Doświadczenia wizualne"],
    accent: "#3ad1c4",
    order: 3,
    featured: true,
  },
  {
    title: "Scenografia cyfrowa na targi",
    slug: "scenografia-cyfrowa-na-targi",
    thumbnail: "/assets/work/scenografia-cyfrowa-na-targi.webp",
    category: "Targi · Scenografia cyfrowa",
    client: "Projekt demonstracyjny",
    year: "2024",
    shortDescription:
      "Cyfrowa scenografia stoiska targowego — duży format, rytm i spójny klimat marki.",
    longDescription:
      "Cyfrowa oprawa stoiska, która wyróżnia markę na tle gwaru targów. Zbudowaliśmy wielkoformatową kompozycję obrazu i światła z własnym rytmem, tak aby przyciągała wzrok z daleka i budowała klimat z bliska.\n\nCałość dograliśmy do architektury stoiska i przygotowaliśmy do pracy przez wszystkie dni wydarzenia.",
    services: [
      "Scenografia cyfrowa",
      "Prezentacje i doświadczenia produktowe",
    ],
    accent: "#ff8a5b",
    order: 4,
    featured: false,
  },
  {
    title: "Doświadczenie wizualne dla przestrzeni marki",
    slug: "doswiadczenie-wizualne-przestrzeni-marki",
    thumbnail: "/assets/work/doswiadczenie-wizualne-przestrzeni-marki.webp",
    category: "Showroom · Brand space",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Doświadczenie wizualne dla showroomu — obraz, światło i ruch budujące charakter miejsca.",
    longDescription:
      "Showroom jako doświadczenie, nie tylko przestrzeń ekspozycyjna. Obraz, światło i ruch budują charakter miejsca i prowadzą odwiedzającego przez markę w spójnej, spokojnej narracji.\n\nZaprojektowaliśmy warstwę wizualną tak, aby wspierała sprzedaż i opowieść o marce, a jednocześnie dobrze znosiła codzienne użytkowanie.",
    services: ["Doświadczenia wizualne", "Scenografia cyfrowa"],
    accent: "#7a8cff",
    order: 5,
    featured: true,
  },
  {
    title: "Koncertowa scena LED",
    slug: "koncertowa-scena-led",
    thumbnail: "/assets/work/koncertowa-scena-led.webp",
    category: "Koncert · Wizualizacje sceniczne",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Wielkoformatowe wizualizacje na ścianę LED zsynchronizowane z rytmem i światłem.",
    services: ["Doświadczenia wizualne", "Scenografia cyfrowa"],
    accent: "#6b79ff",
    order: 6,
    featured: false,
  },
  {
    title: "Mapping na architekturze",
    slug: "mapping-na-architekturze",
    thumbnail: "/assets/work/mapping-na-architekturze.webp",
    category: "Mapping · Architektura",
    client: "Projekt demonstracyjny",
    year: "2024",
    shortDescription:
      "Projekcja wielkoformatowa na elewację — obraz dopasowany do bryły budynku.",
    services: ["Scenografia cyfrowa", "Doświadczenia wizualne"],
    accent: "#3ad1c4",
    order: 7,
    featured: false,
  },
  {
    title: "Interaktywna instalacja świetlna",
    slug: "interaktywna-instalacja-swietlna",
    thumbnail: "/assets/work/interaktywna-instalacja-swietlna.webp",
    category: "Instalacja · Światło",
    client: "Projekt demonstracyjny",
    year: "2024",
    shortDescription:
      "Instalacja ze świateł reagujących na ruch i obecność odwiedzających.",
    services: ["Instalacje interaktywne", "Doświadczenia wizualne"],
    accent: "#7a8cff",
    order: 8,
    featured: false,
  },
  {
    title: "Holograficzna prezentacja 3D",
    slug: "holograficzna-prezentacja-3d",
    thumbnail: "/assets/work/holograficzna-prezentacja-3d.webp",
    category: "Produkt · 3D / Hologram",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Produkt zaprezentowany jako unoszący się render 3D z efektem holograficznym.",
    services: ["Prezentacje i doświadczenia produktowe"],
    accent: "#b06bff",
    order: 9,
    featured: false,
  },
  {
    title: "Immersyjna wystawa LED",
    slug: "immersyjna-wystawa-led",
    thumbnail: "/assets/work/immersyjna-wystawa-led.webp",
    category: "Wystawa · Immersja",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Sala wystawowa z obrazem na ścianach i podłodze — pełne zanurzenie widza.",
    services: ["Doświadczenia wizualne", "Instalacje interaktywne"],
    accent: "#19f0c8",
    order: 10,
    featured: false,
  },
  {
    title: "Generatywna wizualizacja danych",
    slug: "generatywna-wizualizacja-danych",
    thumbnail: "/assets/work/generatywna-wizualizacja-danych.webp",
    category: "Data-art · Generatywne",
    client: "Projekt demonstracyjny",
    year: "2024",
    shortDescription:
      "Dane zamienione w żywą, generatywną kompozycję obrazu w czasie rzeczywistym.",
    services: ["Doświadczenia wizualne"],
    accent: "#6b79ff",
    order: 11,
    featured: false,
  },
  {
    title: "Kinetyczna rzeźba świetlna",
    slug: "kinetyczna-rzezba-swietlna",
    thumbnail: "/assets/work/kinetyczna-rzezba-swietlna.webp",
    category: "Instalacja · Kinetyka",
    client: "Projekt demonstracyjny",
    year: "2023",
    shortDescription:
      "Zawieszona rzeźba ze świateł, której ruch buduje rytm całej przestrzeni.",
    services: ["Instalacje interaktywne", "Scenografia cyfrowa"],
    accent: "#3ad1c4",
    order: 12,
    featured: false,
  },
  {
    title: "Brand space / showroom",
    slug: "brand-space-showroom",
    thumbnail: "/assets/work/brand-space-showroom.webp",
    category: "Brand space · Showroom",
    client: "Projekt demonstracyjny",
    year: "2025",
    shortDescription:
      "Showroom marki z rzeźbiarskim światłem budującym charakter miejsca.",
    services: ["Doświadczenia wizualne", "Scenografia cyfrowa"],
    accent: "#7a8cff",
    order: 13,
    featured: false,
  },
];
