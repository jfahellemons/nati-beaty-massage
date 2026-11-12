import { whatsappUrl } from "@/content/site";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { PillLink } from "@/components/ui/PillLink";
import { CancellationNote } from "@/components/ui/CancellationNote";
import { OpenBookingButton } from "@/components/booking/BookButton";
import { ServiceCards } from "./ServiceCards";

function AdviceCard() {
  return (
    <article
      data-reveal
      className="flex min-h-[260px] flex-col justify-between gap-7 rounded-card bg-ink px-7 py-8 text-ivory sm:col-span-2 sm:flex-row sm:items-end sm:gap-10 sm:px-10 sm:py-10"
    >
      <div className="flex flex-col gap-7">
        <span className="flex size-[42px] items-center justify-center rounded-full border border-sand/50 text-sand">
          <Icon name="sparkle" size={20} strokeWidth={1.4} />
        </span>
        <div className="flex max-w-[420px] flex-col gap-3">
          <h3 className="font-serif text-[32px] leading-[1.1] font-normal text-sand">
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
          <div data-reveal className="flex max-w-[560px] flex-col gap-[18px]">
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
          <div data-reveal className="flex max-w-[440px] flex-col gap-5">
            <p className="text-base leading-[1.65] text-pretty text-muted">
              Of u nu verlichting zoekt voor spierspanning, wilt ontsnappen aan een drukke week of zichzelf
              wilt verwennen: elke behandeling wordt afgestemd op wat uw lichaam nodig heeft.
            </p>
            <OpenBookingButton variant="outline" size="md" className="self-start font-normal">
              Plan uw behandeling
            </OpenBookingButton>
          </div>
        </div>

        <ServiceCards>
          <AdviceCard />
        </ServiceCards>

        <div data-reveal="fade" className="-mt-6 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <CancellationNote />
          <p className="text-[13px] text-muted-2">U kiest de duur van uw behandeling bij het boeken.</p>
        </div>
      </div>
    </section>
  );
}
