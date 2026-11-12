import type { StaticImageData } from "next/image";
import imgTherapeutisch from "@/assets/images/svc-therapeutische.webp";
import imgVolledig from "@/assets/images/svc-volledig-lichaam.webp";
import imgCranio from "@/assets/images/svc-craniofaciaal.webp";
import imgRug from "@/assets/images/svc-rug-nek-schouder.webp";
import imgBenen from "@/assets/images/svc-benen-voeten.webp";
import imgPedicure from "@/assets/images/svc-pedicure.webp";

export type Duration = 30 | 60 | 75 | 90;

export type Service = {
  /** Stable id, also stored on bookings (service_slug) in the shared database. */
  slug: string;
  title: string;
  /** Short lead line shown above the description. */
  tagline: string;
  /** One string per paragraph. */
  description: string[];
  /** Price in euros per offered duration. Source: official price list. */
  prices: Partial<Record<Duration, number>>;
  image: StaticImageData;
  imageAlt: string;
  /** SVG path data, 24×24 viewBox, stroked. */
  icon: string;
};

export const services: Service[] = [
  {
    slug: "therapeutische-massage",
    title: "Therapeutische massage",
    tagline: "Gerichte aandacht voor spierknopen en opgebouwde spanning.",
    description: [
      "Een complete lichaamsmassage met extra aandacht voor de rug. Met stevigere en gerichte massagetechnieken behandel ik vastzittende spieren en spierknopen. Ook de benen en voeten worden meegenomen in de behandeling.",
      "Ik combineer diepere massagetechnieken met ontspannende bewegingen, zodat het lichaam weer tot rust kan komen.",
    ],
    prices: { 30: 40, 60: 60, 75: 70, 90: 95 },
    image: imgTherapeutisch,
    imageAlt: "Therapeutische massage van de rug",
    icon: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M12 3v3 M12 18v3 M3 12h3 M18 12h3",
  },
  {
    slug: "volledige-lichaamsmassage",
    title: "Ontspanningsmassage",
    tagline: "Laat de dagelijkse stress los en geniet van pure ontspanning.",
    description: [
      "Een zachte lichaamsmassage met rustgevende muziek, verkoelende waterballen, zachte veren en een heerlijke hoofdmassage met speciale massagetools. Een unieke zintuiglijke ervaring om lichaam en geest tot rust te brengen.",
    ],
    prices: { 30: 40, 60: 55, 75: 65, 90: 90 },
    image: imgVolledig,
    imageAlt: "Ontspannende oliemassage van het hele lichaam",
    icon: "M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 8v7 M7 11h10 M12 15l-3 5 M12 15l3 5",
  },
  {
    slug: "craniofaciale-massage",
    title: "Craniofaciale Ontspanningsritueel",
    tagline: "Een bijzonder ritueel om helemaal tot jezelf te komen.",
    description: [
      "Een sensorische ontspanningservaring voor het hoofd, de hoofdhuid en het gezicht, met zachte massagetechnieken, rustgevende geluiden en speciale ontspanningsaccessoires zoals massagekammen en hoofdhuidtools.",
    ],
    prices: { 30: 35, 60: 55, 75: 65, 90: 90 },
    image: imgCranio,
    imageAlt: "Nataly masseert het hoofd van een cliënt",
    icon: "M12 3.5a6 6 0 0 1 6 6v2a6 6 0 0 1-12 0v-2a6 6 0 0 1 6-6z M9.5 10.5h.01 M14.5 10.5h.01 M10 14.5c1 .8 3 .8 4 0 M9 21h6",
  },
  {
    slug: "rug-nek-schoudermassage",
    title: "Rug-, nek- en schoudermassage",
    tagline: "Geef spanning in je rug, nek en schouders de aandacht die het verdient.",
    description: [
      "Een gerichte massage om opgebouwde spanning en vastzittende spieren te helpen verlichten. Met gerichte massagetechnieken, ontspannende bewegingen en warme handdoeken creëer ik een heerlijk ontspannen gevoel en een moment van rust.",
    ],
    prices: { 30: 35, 60: 50, 75: 65 },
    image: imgRug,
    imageAlt: "Massage van rug, nek en schouders",
    icon: "M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M4 20c0-6 3.5-10 8-10s8 4 8 10 M12 12v8",
  },
  {
    slug: "benen-voetenmassage",
    title: "Benen- en voetenmassage",
    tagline: "Geef vermoeide benen en voeten een moment van verlichting.",
    description: [
      "Een ontspannende massage gericht op de kuiten en voetzolen, om opgebouwde spanning en vermoeidheid te helpen verminderen en je benen weer heerlijk ontspannen te laten voelen.",
    ],
    prices: { 30: 35, 60: 50, 75: 65 },
    image: imgBenen,
    imageAlt: "Massage van benen en voeten",
    icon: "M9 3v12l-3 5h5l1-5 M15 3v12l3 5h-5",
  },
  {
    slug: "pedicure-spa",
    title: "Pedicure Spa",
    tagline: "Meer dan een pedicure: complete verzorging voor je voeten.",
    description: [
      "Inclusief het verwijderen van eelt en harde plekjes, nagelriemverzorging, exfoliatie, nagellak en een ontspannende voetmassage.",
    ],
    prices: { 60: 60 },
    image: imgPedicure,
    imageAlt: "Verzorgende pedicure behandeling",
    icon: "M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z",
  },
];

export function getService(slug: string | null | undefined) {
  return services.find((s) => s.slug === slug);
}

/** Offered durations with their price, shortest first. */
export function offered(service: Service) {
  return (Object.entries(service.prices) as [string, number][])
    .map(([min, price]) => ({ min: Number(min) as Duration, price }))
    .sort((a, b) => a.min - b.min);
}

/** "30 – 90 min" or "60 min". */
export function durationLabel(service: Service) {
  const list = offered(service);
  const first = list[0].min;
  const last = list[list.length - 1].min;
  return first === last ? `${first} min` : `${first} – ${last} min`;
}

export function lowestPrice(service: Service) {
  return Math.min(...Object.values(service.prices));
}

/** True when the client can choose between several durations. */
export function hasRange(service: Service) {
  return offered(service).length > 1;
}
