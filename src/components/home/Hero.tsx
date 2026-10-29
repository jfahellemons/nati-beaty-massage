import Image from "next/image";
import heroImg from "@/assets/images/hero.jpeg";
import heroCardImg from "@/assets/images/hero-card.webp";
import { PillLink } from "@/components/ui/PillLink";
import { Icon } from "@/components/ui/Icon";
import { OpenBookingButton } from "@/components/booking/BookButton";
import Link from "next/link";
import { delay } from "@/components/motion/delay";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] overflow-hidden bg-espresso text-ivory md:min-h-[clamp(700px,100vh,940px)]">
      {/* Photo: full-bleed on phones, 62% wide with a left fade on desktop. */}
      <div className="hero-parallax absolute inset-y-0 right-0 w-full md:w-[62%] md:[mask-image:linear-gradient(to_right,transparent_0%,#000_38%)]">
        <Image
          src={heroImg}
          alt="Nataly geeft een rugmassage in haar salon"
          fill
          preload
          fetchPriority="high"
          sizes="(min-width: 860px) 62vw, 100vw"
          placeholder="blur"
          className="animate-settle object-cover object-[30%_30%] md:object-[50%_42%]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(30,23,19,.45)_0%,rgba(30,23,19,.2)_30%,rgba(30,23,19,.92)_72%)] md:bg-[linear-gradient(180deg,rgba(30,23,19,.35)_0%,transparent_25%,transparent_60%,rgba(30,23,19,.55)_100%)]"
      />

      <div className="relative z-1 mx-auto flex w-full max-w-[1320px] flex-col justify-end gap-14 px-5 pt-[120px] pb-[84px] md:px-[clamp(20px,5vw,64px)] md:pt-[150px] md:pb-[104px]">
        <div className="flex max-w-[600px] flex-col gap-[26px]">
          <span
            className="flex animate-fade-up items-center gap-2.5 text-xs tracking-[0.28em] text-sand-soft uppercase"
            style={delay(100)}
          >
            <span aria-hidden="true" className="eyebrow-line h-px w-7 bg-sand-soft" />
            Massage &amp; Schoonheid
          </span>
          <h1 className="text-[clamp(42px,6vw,82px)] leading-[1.02] font-light tracking-[-0.02em] text-balance">
            <span className="block animate-fade-up" style={delay(200)}>
              Herstel uw balans.
            </span>
            <span
              className="block animate-fade-up font-serif font-normal tracking-[-0.01em] text-sand"

              style={delay(320)}
            >
              Straal van schoonheid.
            </span>
          </h1>
          <p
            style={delay(440)}
            className="max-w-[500px] animate-fade-up text-[clamp(16px,1.4vw,18px)] leading-[1.65] font-light text-pretty text-on-dark-2"
          >
            Gespecialiseerde behandelingen om uw lichaam en geest te ontspannen, van therapeutische massage
            tot verzorgende pedicure.
          </p>
          <div id="hero-cta" className="mt-1.5 flex animate-fade-up flex-wrap gap-3" style={delay(560)}>
            <OpenBookingButton variant="bronze" size="lg">
              Boek een Sessie
            </OpenBookingButton>
            <PillLink href="/#behandelingen" variant="ghost-dark" size="lg" className="font-normal">
              Bekijk Behandelingen
            </PillLink>
          </div>
        </div>

        <div className="hidden justify-end md:flex">
          <div
            style={delay(800)}
            className="flex max-w-[440px] animate-fade-up items-center gap-[18px] rounded-3xl border border-ivory/22 bg-ivory/10 p-2.5 backdrop-blur-[16px]"
          >
            <Image
              src={heroCardImg}
              alt="Close-up van een verzorgende behandeling"
              width={118}
              height={118}
              className="size-[118px] shrink-0 rounded-2xl object-cover"
            />
            <div className="flex flex-col gap-3.5 pr-2">
              <p className="text-base leading-[1.45] text-ivory">
                Een verzorgende ervaring voor uw huid, uw lichaam en uw rust.
              </p>
              <Link
                href="/#behandelingen"
                className="flex items-center gap-2 text-[13px] text-sand hover:text-ivory"
              >
                Ontdek alle behandelingen <Icon name="arrow" size={13} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
