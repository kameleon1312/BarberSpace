import type {
  NavItem,
  PriceItem,
  ServiceItem,
  ProcessStep,
  TestimonialItem,
  TeamMember,
  FaqItem,
} from "../types/ui";

export const brand = {
  name: "BarberSpace",
  tagline: "Barber · Warszawa Centrum",
};

export const salon = {
  phone: "+48 123 123 123",
  phoneHref: "tel:+48123123123",
  email: "kontakt@barberspace.pl",
  address: "Złote Tarasy, Warszawa",
  mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Zlote+Tarasy+Warszawa",
  lat: 52.2306,
  lng: 21.0027,
  hoursLabel: "Pn–Sb · 10:00–20:00",
  openHour: 10,
  closeHour: 20,
};

export const nav: NavItem[] = [
  { label: "Usługi", href: "#uslugi" },
  { label: "Cennik", href: "#cennik" },
  { label: "Galeria", href: "#galeria" },
  { label: "Kontakt", href: "#kontakt" },
];

export const services: ServiceItem[] = [
  {
    title: "Strzyżenie",
    desc: "Konsultacja, cięcie nożyczkami lub maszynką, mycie i stylizacja.",
    meta: "30–45 min",
  },
  {
    title: "Broda",
    desc: "Trymowanie, kontur brzytwą, gorący ręcznik i olejek.",
    meta: "20–35 min",
  },
  {
    title: "Combo",
    desc: "Włosy i broda w jednej wizycie, jeden spójny efekt.",
    meta: "50–70 min",
  },
];

export const processSteps: ProcessStep[] = [
  { num: "1", title: "Wybierasz termin", desc: "Usługa, barber i godzina. Zajmuje pół minuty." },
  { num: "2", title: "Dostajesz potwierdzenie", desc: "Dzwonimy lub piszemy, żeby potwierdzić wizytę." },
  { num: "3", title: "Siadasz od razu", desc: "Pracujemy na rezerwacje, więc nie czekasz w kolejce." },
  { num: "4", title: "Płacisz po wizycie", desc: "Gotówka lub karta, na miejscu." },
];

export const pricing: PriceItem[] = [
  { name: "Strzyżenie", time: "40 min", price: "90 zł" },
  { name: "Broda", time: "30 min", price: "70 zł" },
  {
    name: "Combo",
    time: "70 min",
    price: "150 zł",
    note: "Najczęściej wybierane",
    featured: true,
  },
  { name: "Skin Fade", time: "55 min", price: "110 zł", note: "Cieniowanie do skóry" },
];

export const testimonials: TestimonialItem[] = [
  {
    quote: "Trafiłem tu przez rekomendację i już nie szukam innego barbera. Każda wizyta to ten sam poziom — perfekcja bez kompromisów.",
    author: "Michał K.",
    service: "Skin Fade",
    date: "Marzec 2025",
  },
  {
    quote: "Broda od miesięcy wygląda jak po wizycie. Nauczyli mnie jak dbać — mały detal, wielka różnica w codziennym wyglądzie.",
    author: "Tomasz R.",
    service: "Combo",
    date: "Luty 2025",
  },
  {
    quote: "Ceny uczciwe, czas krótki, efekt dokładnie taki jak chciałem. Bez rozczarowań, bez gadania. Wróciłem trzy razy.",
    author: "Adrian S.",
    service: "Strzyżenie",
    date: "Kwiecień 2025",
  },
];

export const team: TeamMember[] = [
  {
    name: "Marek",
    role: "Founder & Senior Barber",
    specialty: "Skin Fade · Klasyk · Broda",
    years: 9,
    bio: "Zaczynał od tradycyjnego salonu, dziś tworzy własny styl. Precyzja spotyka charakter — i to widać w każdym cięciu.",
  },
  {
    name: "Kuba",
    role: "Barber",
    specialty: "Tekstura · Beard Styling · Fade",
    years: 5,
    bio: "Mistrz faktury i wykończenia. Każdy detal to świadoma decyzja, nie przypadek.",
  },
];

export const faq: FaqItem[] = [
  {
    question: "Czy muszę rezerwować wizytę z wyprzedzeniem?",
    answer: "Tak, pracujemy wyłącznie na rezerwację — bez kolejek, bez czekania. Termin rezerwujesz online w około 20 sekund.",
  },
  {
    question: "Ile z wyprzedzeniem powinienem zarezerwować?",
    answer: "Zazwyczaj 2–4 dni wystarczą. W tygodniu jest więcej wolnych terminów niż w weekendy.",
  },
  {
    question: "Co jeśli efekt nie będzie taki jak chciałem?",
    answer: "Zawsze zaczynamy od krótkiej konsultacji — opowiedz co chcesz osiągnąć i pokażemy możliwości. Jeśli coś nie wyszło zgodnie z ustaleniami, poprawiamy bez dodatkowych kosztów.",
  },
  {
    question: "Jak długo trwa wizyta?",
    answer: "Strzyżenie to ok. 40–45 min, broda 30–35 min, combo ok. 70–75 min. Dokładny czas zależy od długości włosów i oczekiwanego efektu.",
  },
  {
    question: "Jakie formy płatności akceptujecie?",
    answer: "Gotówka i karta — oba sposoby działają. Płatność po wizycie przy wyjściu.",
  },
  {
    question: "Jak dbać o włosy między wizytami?",
    answer: "Po każdej wizycie dostaniesz konkretne wskazówki — jaki produkt, jak nakładać, jak często. Zawsze możesz też zapytać barbera bezpośrednio podczas wizyty.",
  },
];

export const bookingServices = [
  {
    id: "hair",
    name: "Strzyżenie",
    durationMin: 45,
    priceFrom: 90,
    priceTo: 130,
    desc: "Konsultacja + cięcie + stylizacja.",
  },
  {
    id: "beard",
    name: "Broda",
    durationMin: 35,
    priceFrom: 70,
    priceTo: 110,
    desc: "Trym + kontur + pielęgnacja.",
  },
  {
    id: "combo",
    name: "Strzyżenie + Broda",
    durationMin: 75,
    priceFrom: 150,
    priceTo: 210,
    desc: "Włosy i broda w jednej wizycie.",
  },
  {
    id: "fade",
    name: "Skin Fade",
    durationMin: 55,
    priceFrom: 110,
    priceTo: 160,
    desc: "Precyzyjny fade + wykończenie.",
  },
] as const;

export type BookingService = (typeof bookingServices)[number];
export type BookingServiceId = BookingService["id"];
