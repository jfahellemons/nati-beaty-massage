import type { Metadata } from "next";
import Image from "next/image";
import portrait from "@/assets/images/about-portrait.webp";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFab } from "@/components/layout/FloatingActions";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { OpenBookingButton } from "@/components/booking/BookButton";

export const metadata: Metadata = {
  title: "Over Mij",
  description:
    "Maak kennis met Nataly: 10 jaar ervaring in de wellnesssector, in Oosterhout.",
  alternates: { canonical: "/over-mij" },
};

const pillars = [
  {
    n: "01",
    title: "Ervaring & Vakmanschap",
    text: "Tien jaar lang verfijnde therapeutische en ontspannende technieken om opgebouwde spanning los te laten en uw energie te herstellen.",
  },
  {
    n: "02",
    title: "Verzorging van top tot teen",
    text: "Naast massages biedt Nataly een verzorgende pedicure spa, als aanvulling op uw complete ontspanning.",
  },
  {
    n: "03",
    title: "Persoonlijke Aandacht",
    text: "Elke sessie wordt op maat samengesteld en afgestemd op uw specifieke behoeften, voor het beste resultaat.",
  },
  {
    n: "04",
    title: "Exclusieve Sfeer in Oosterhout",
    text: "Een professionele, warme en verfijnde ruimte waar u volledig loskomt van de dagelijkse drukte en weer tot uzelf komt.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader current="/over-mij" />
      <main id="main">
        <section className="px-[clamp(20px,5vw,64px)] pt-[clamp(56px,8vw,112px)] pb-[clamp(56px,7vw,96px)]">
          <div className="mx-auto grid max-w-[1192px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-center gap-[clamp(40px,6vw,96px)]">
            <figure className="flex w-full max-w-[460px] flex-col gap-3.5 justify-self-center">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] bg-line">
                <Image
                  src={portrait}
                  alt="Portret van Nataly"
                  fill
                  preload
                  sizes="(min-width: 860px) 460px, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
              <figcaption className="flex justify-between gap-3 px-1 text-[13px] text-muted-2">
                <span>Nataly, eigenaar</span>
                <span>{site.city}</span>
              </figcaption>
            </figure>

            <div className="flex flex-col gap-6">
              <span className="flex items-center gap-2.5 text-xs tracking-[0.28em] text-bronze-deep uppercase">
                <span aria-hidden="true" className="h-px w-7 bg-bronze" />
                Welzijn, harmonie &amp; professionele zorg
              </span>
              <h1 className="text-[clamp(40px,5.2vw,68px)] leading-[1.04] font-normal tracking-[-0.02em]">
                Maak kennis met <Accent>Nataly</Accent>
              </h1>
              <p className="max-w-[540px] text-[clamp(16px,1.4vw,18px)] leading-[1.75] text-pretty text-body">
                Met <strong className="font-medium text-ink">10 jaar ervaring</strong> in de wellnesssector
                zet ik mij in om het fysieke en mentale evenwicht van ieder mens te herstellen. Vanuit{" "}
                <strong className="font-medium text-ink">{site.city}</strong> is het mijn missie een plek van
                ontspanning en diepe vernieuwing te bieden, afgestemd op de persoonlijke behoeften van elke
                klant.
              </p>
              <dl className="flex flex-wrap gap-9 border-t border-line pt-6">
                <div className="flex flex-col-reverse gap-1">
                  <dt className="text-[13px] text-muted-2">jaar ervaring</dt>
                  <dd className="font-serif text-[44px] leading-none">10</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="werkwijze-title"
          className="bg-ivory px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,120px)]"
        >
          <div className="mx-auto flex max-w-[1192px] flex-col gap-12">
            <div className="flex max-w-[620px] flex-col gap-[18px]">
              <Eyebrow>Mijn werkwijze</Eyebrow>
              <h2
                id="werkwijze-title"
                className="text-[clamp(34px,4.2vw,54px)] leading-[1.08] font-normal tracking-[-0.015em]"
              >
                Filosofie &amp; <Accent>Professionele Aanpak</Accent>
              </h2>
            </div>
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
              {pillars.map((p) => (
                <li
                  key={p.n}
                  className="flex gap-[22px] rounded-card border border-line-soft bg-cream px-[30px] py-8"
                >
                  <span
                    aria-hidden="true"
                    className="w-9 shrink-0 font-serif text-[30px] leading-none text-bronze"
                  >
                    {p.n}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-xl leading-snug font-medium">{p.title}</h3>
                    <p className="text-[15px] leading-[1.65] text-pretty text-muted">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,120px)]">
          <figure className="mx-auto flex max-w-[860px] flex-col items-center gap-5 text-center">
            <span aria-hidden="true" className="h-9 font-serif text-[80px] leading-[0.5] text-sand-muted">
              “
            </span>
            <blockquote className="font-serif text-[clamp(28px,3.4vw,44px)] leading-tight text-balance text-ink italic">
              Welzijn is geen luxe, maar een essentiële investering in uw gezondheid en innerlijke harmonie.
            </blockquote>
            <figcaption className="text-xs tracking-[0.28em] text-bronze-deep uppercase">Nataly</figcaption>
          </figure>
        </section>

        <section className="px-[clamp(20px,5vw,64px)]">
          <div className="mx-auto flex max-w-[1192px] flex-wrap items-center justify-between gap-7 rounded-[32px] bg-ink p-[clamp(40px,5vw,64px)] text-ivory">
            <div className="flex max-w-[560px] flex-col gap-2.5">
              <h2 className="font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.1] font-normal text-sand italic">
                Ik verwelkom u graag in {site.city}.
              </h2>
              <p className="text-base leading-relaxed text-on-dark">
                Plan uw behandeling en gun uzelf een moment van rust.
              </p>
            </div>
            <OpenBookingButton variant="bronze" size="lg">
              Boek een Sessie
            </OpenBookingButton>
          </div>
        </section>
      </main>
      <MinimalFooter />
      <WhatsAppFab />
    </div>
  );
}
