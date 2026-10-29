import Image from "next/image";
import finalImg from "@/assets/images/final-cta.webp";
import { site } from "@/content/site";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { Icon, icons } from "@/components/ui/Icon";
import { CancellationNote } from "@/components/ui/CancellationNote";
import { OpenBookingButton } from "@/components/booking/BookButton";

type Contact = { label: string; value: string; icon: keyof typeof icons; href?: string; external?: boolean };

const contacts: Contact[] = [
  { label: "Bel of app", value: site.phone.display, icon: "phone", href: site.phone.href },
  { label: "E-mailadres", value: site.email, icon: "mail", href: `mailto:${site.email}` },
  { label: "Locatie", value: site.city, icon: "pin" },
  {
    label: "Instagram",
    value: site.instagram.handle,
    icon: "instagram",
    href: site.instagram.url,
    external: true,
  },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ivory px-[clamp(20px,5vw,64px)] pt-[clamp(72px,9vw,120px)]"
    >
      <div className="mx-auto grid max-w-[1192px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(40px,6vw,88px)]">
        <div className="flex flex-col gap-[22px]">
          <div data-reveal className="flex flex-col gap-[22px]">
            <Eyebrow>Plan uw bezoek</Eyebrow>
            <h2
              id="contact-title"
              className="text-[clamp(34px,4.2vw,54px)] leading-[1.08] font-normal tracking-[-0.015em]"
            >
              Begin Uw Wellness
              <br />
              <Accent>Reis Vandaag</Accent>
            </h2>
            <p className="max-w-[440px] text-base leading-[1.65] text-pretty text-muted">
              Vraag uw behandeling aan in een paar stappen. Nataly bevestigt uw afspraak persoonlijk, meestal
              binnen enkele uren.
            </p>
          </div>

          <ul className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 border-t border-line-softer pt-7">
            {contacts.map((c) => {
              const value = (
                <span className="flex items-center gap-2.5 text-[15px] break-all text-ink">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-chip text-bronze-deep transition-colors duration-300 group-hover/contact:bg-bronze group-hover/contact:text-white">
                    <Icon name={c.icon} size={15} strokeWidth={1.7} />
                  </span>
                  {c.value}
                </span>
              );
              return (
                <li key={c.label} data-reveal className="flex flex-col gap-2.5">
                  <span className="text-xs tracking-[0.06em] text-muted-2">{c.label}</span>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="group/contact hover:[&>span]:text-bronze-deep"
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div
          data-reveal
          className="flex flex-col gap-[22px] rounded-[30px] bg-ink p-[clamp(28px,4vw,48px)] text-ivory"
        >
          <h3 className="font-serif text-[clamp(30px,3.2vw,42px)] leading-[1.1] font-normal text-sand">
            Reserveer in een paar stappen
          </h3>
          <p className="text-base leading-relaxed text-on-dark">
            Kies uw behandeling, de duur, een datum en tijd. Nataly bevestigt uw afspraak persoonlijk.
          </p>
          <OpenBookingButton variant="bronze" size="lg" className="self-start">
            Afspraak Maken
          </OpenBookingButton>
          <CancellationNote tone="dark" />
        </div>
      </div>

      <div className="relative mx-auto mt-[clamp(56px,7vw,96px)] max-w-[1192px]">
        <div
          data-reveal="clip"
          className="relative h-[clamp(320px,42vw,560px)] overflow-hidden rounded-[32px] bg-line"
        >
          <Image
            src={finalImg}
            alt="Ontspannen sfeer tijdens een behandeling"
            fill
            sizes="(min-width: 1192px) 1192px, 100vw"
            placeholder="blur"
            className="object-cover"
          />
          {/* Soft dark fade at the bottom so the text reads on any photo. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(30,23,19,.82)_100%)]"
          />
          <div
            data-reveal
            className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-[clamp(24px,4vw,48px)]"
          >
            <Eyebrow tone="dark">{site.name}</Eyebrow>
            <h3 className="max-w-[520px] font-serif text-[clamp(30px,3.6vw,46px)] leading-[1.08] font-normal text-balance text-ivory">
              Uw moment van rust begint hier.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
