import Image from "next/image";
import { durationLabel, hasRange, lowestPrice, services, type Service } from "@/content/services";
import { whatsappUrl } from "@/content/site";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PillLink } from "@/components/ui/PillLink";
import { CancellationNote } from "@/components/ui/CancellationNote";
import { BookButton, OpenBookingButton } from "@/components/booking/BookButton";

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="flex flex-col rounded-card border border-line-soft bg-ivory p-2.5 transition-[box-shadow,transform] duration-300 [@media(hover:hover)]:hover:-translate-y-[3px] [@media(hover:hover)]:hover:shadow-card-hover">
      <div className="relative h-[200px] shrink-0 overflow-hidden rounded-[18px] bg-line">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1100px) 280px, (min-width: 640px) 45vw, 100vw"
          placeholder="blur"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 flex size-[42px] items-center justify-center rounded-full bg-ivory text-bronze-deep shadow-[0_4px_14px_rgba(42,33,28,.1)]">
          <Icon d={service.icon} size={20} strokeWidth={1.4} />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-3.5 pt-5 pb-3">
        <h3 className="text-[19px] leading-tight font-medium">{service.title}</h3>
        <p className="flex-1 text-sm leading-relaxed text-pretty text-muted">{service.description}</p>
        <div className="flex items-end justify-between gap-2.5 border-t border-line-softer pt-3.5">
          <span className="flex items-center gap-[7px] text-[13px] text-muted-2">
            <Icon name="clock" size={15} className="text-bronze-deep" />
            {durationLabel(service)}
          </span>
          <span className="flex items-baseline gap-1.5 leading-none">
            {hasRange(service) && <span className="text-[13px] text-muted-2">vanaf</span>}
            <span className="font-serif text-[26px] text-ink">€{lowestPrice(service)}</span>
          </span>
        </div>
        <BookButton
          slug={service.slug}
          variant="outline-soft"
          size="sm"
          className="mt-1.5 self-start font-normal"
        >
          Boek Nu<span className="sr-only">: {service.title}</span>
        </BookButton>
      </div>
    </article>
  );
}

function AdviceCard() {
  return (
    <article className="flex min-h-[260px] flex-col justify-between gap-7 rounded-card bg-ink px-7 py-8 text-ivory sm:col-span-2 sm:flex-row sm:items-end sm:gap-10 sm:px-10 sm:py-10">
      <div className="flex flex-col gap-7">
        <span className="flex size-[42px] items-center justify-center rounded-full border border-sand/50 text-sand">
          <Icon name="sparkle" size={20} strokeWidth={1.4} />
        </span>
        <div className="flex max-w-[420px] flex-col gap-3">
          <h3 className="font-serif text-[32px] leading-[1.1] font-normal text-sand italic">
            Twijfelt u welke behandeling bij u past?
          </h3>
          <p className="text-sm leading-relaxed text-on-dark">
            Nataly adviseert u graag persoonlijk, afgestemd op uw klachten en wensen.
          </p>
        </div>
      </div>
      <PillLink
        href={whatsappUrl("Hallo Nataly, ik twijfel welke behandeling bij mij past. Kunt u mij adviseren?")}
        external
        variant="ivory"
        size="sm"
        className="shrink-0 self-start shadow-none sm:self-end"
      >
        Vraag Advies
      </PillLink>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section
      id="behandelingen"
      aria-labelledby="behandelingen-title"
      className="bg-cream px-[clamp(20px,5vw,64px)] py-[clamp(72px,9vw,120px)]"
    >
      <div className="mx-auto flex max-w-[1192px] flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div className="flex max-w-[560px] flex-col gap-[18px]">
            <Eyebrow>Onze Behandelingen</Eyebrow>
            <h2
              id="behandelingen-title"
              className="text-[clamp(34px,4.2vw,54px)] leading-[1.08] font-normal tracking-[-0.015em]"
            >
              Onze <Accent>Gespecialiseerde</Accent>
              <br />
              Behandelingen
            </h2>
          </div>
          <div className="flex max-w-[440px] flex-col gap-5">
            <p className="text-base leading-[1.65] text-pretty text-muted">
              Of u nu verlichting zoekt voor spierspanning, wilt ontsnappen aan een drukke week of zichzelf
              wilt verwennen: elke behandeling wordt afgestemd op wat uw lichaam nodig heeft.
            </p>
            <OpenBookingButton variant="outline" size="md" className="self-start font-normal">
              Plan uw behandeling
            </OpenBookingButton>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
          <AdviceCard />
        </div>

        <div className="-mt-6 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <CancellationNote />
          <p className="text-[13px] text-muted-2">
            Alle prijzen zijn inclusief BTW. U kiest de duur van uw behandeling bij het boeken.
          </p>
        </div>
      </div>
    </section>
  );
}
