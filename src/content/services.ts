import type { StaticImageData } from "next/image";
import imgTherapeutisch from "@/assets/images/svc-therapeutische.webp";
import imgVolledig from "@/assets/images/svc-volledig-lichaam.webp";
import imgCranio from "@/assets/images/svc-craniofaciaal.webp";
import imgRug from "@/assets/images/svc-rug-nek-schouder.webp";
import imgBenen from "@/assets/images/svc-benen-voeten.webp";
import imgPedicure from "@/assets/images/svc-pedicure.webp";

export type Duration = 30 | 60 | 75 | 90;

export type Service = {
  /** Also the Cal.com event-type slug. */
  slug: string;
  title: string;
  description: string;
  /** Price in euros (incl. BTW) per offered duration. Source: official price list. */
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
    description: "Gerichte behandeling voor diepere spierverlichting en spanningsafbouw.",
    prices: { 30: 40, 60: 60, 75: 70, 90: 95 },
    image: imgTherapeutisch,
    imageAlt: "Therapeutische massage van de rug",
    icon: "M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M12 3v3 M12 18v3 M3 12h3 M18 12h3",
  },
  {
    slug: "volledige-lichaamsmassage",
    title: "Ontspannende volledige lichaamsmassage",
    description: "Ervaar diepe rust van top tot teen met een rustgevende oliemassage.",
    prices: { 30: 40, 60: 55, 75: 65, 90: 90 },
    image: imgVolledig,
    imageAlt: "Ontspannende oliemassage van het hele lichaam",
    icon: "M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M12 8v7 M7 11h10 M12 15l-3 5 M12 15l3 5",
  },
  {
    slug: "craniofaciale-massage",
    title: "Ontspannende craniofaciale massage",
    description: "Subtiele, zachte druktechnieken om stress en spanning in hoofd en nek te verminderen.",
    prices: { 30: 35, 60: 55, 75: 65, 90: 90 },
    image: imgCranio,
    imageAlt: "Nataly masseert het hoofd van een cliënt",
    icon: "M12 3.5a6 6 0 0 1 6 6v2a6 6 0 0 1-12 0v-2a6 6 0 0 1 6-6z M9.5 10.5h.01 M14.5 10.5h.01 M10 14.5c1 .8 3 .8 4 0 M9 21h6",
  },
  {
    slug: "rug-nek-schoudermassage",
    title: "Rug-, nek- en schoudermassage",
    description: "Focus op de meest voorkomende stressplekken voor directe verlichting.",
    prices: { 30: 35, 60: 50, 75: 65 },
    image: imgRug,
    imageAlt: "Massage van rug, nek en schouders",
    icon: "M12 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M4 20c0-6 3.5-10 8-10s8 4 8 10 M12 12v8",
  },
  {
    slug: "benen-voetenmassage",
    title: "Benen- en voetenmassage",
    description: "Revitaliseer vermoeide benen en voeten, perfect na een lange dag.",
    prices: { 30: 35, 60: 50, 75: 65 },
    image: imgBenen,
    imageAlt: "Massage van benen en voeten",
    icon: "M9 3v12l-3 5h5l1-5 M15 3v12l3 5h-5",
  },
  {
    slug: "pedicure-spa",
    title: "Pedicure SPA",
    description: "Luxe voetverzorging inclusief scrub, massage en nagelstyling.",
    prices: { 60: 60 },
    image: imgPedicure,
    imageAlt: "Verzorgende pedicure behandeling",
    icon: "M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z",
  },
];

export function getService(slug: string | null | undefined) {
  return services.find((s) => s.slug === slug);
}

function offered(service: Service) {
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
