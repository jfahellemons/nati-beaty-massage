export const site = {
  name: "Nataly Beauty Massages",
  shortName: "Nataly",
  tagline: "beauty massages",
  description:
    "Therapeutische en ontspannende massages en pedicure spa in Oosterhout. Persoonlijke aandacht, afgestemd op wat uw lichaam nodig heeft.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://natalybeautymassages.nl",
  city: "Oosterhout",
  phone: {
    display: "06 1980 0612",
    href: "tel:+31619800612",
    e164: "+31619800612",
  },
  email: "natalypereyrav@gmail.com",
  whatsapp: {
    number: "31619800612",
    message: "Hallo Nataly, ik wil graag een afspraak maken.",
  },
  instagram: {
    handle: "@beautymassagesnataly",
    url: "https://www.instagram.com/beautymassagesnataly",
  },
  cancellationNote: "Annuleren of wijzigen kan tot 24 uur voor uw afspraak.",
} as const;

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { label: "Over Mij", href: "/over-mij" },
  { label: "Behandelingen", href: "/#behandelingen" },
  { label: "Contact", href: "/#contact" },
] as const;
