import type { Metadata } from "next";
import { Suspense } from "react";
import { site, whatsappUrl } from "@/content/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalFooter } from "@/components/layout/SiteFooter";
import { Accent, Eyebrow } from "@/components/ui/Eyebrow";
import { PillLink } from "@/components/ui/PillLink";
import { OpenBookingButton } from "@/components/booking/BookButton";
import { AutoOpenBooking } from "./AutoOpenBooking";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Afspraak maken",
  description: `Vraag online een afspraak aan bij ${site.name} in ${site.city}.`,
  alternates: { canonical: "/afspraak" },
};

/**
 * Shareable booking link (Instagram bio, WhatsApp): opens the booking dialog,
 * optionally for one service (?dienst=<slug>). Without JavaScript it shows how to book by phone.
 */
export default function BookingPage() {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <PageTransition>
        <main id="main" className="px-[clamp(20px,5vw,64px)] pt-[clamp(48px,7vw,96px)]">
          <div className="mx-auto flex max-w-[640px] flex-col gap-6">
            <Eyebrow>Plan uw bezoek</Eyebrow>
            <h1 className="text-[clamp(36px,4.6vw,56px)] leading-[1.06] font-normal tracking-[-0.02em]">
              Afspraak <Accent>maken</Accent>
            </h1>
            <p className="text-base leading-[1.65] text-muted">
              Kies uw behandeling, de duur, een datum en tijd. Nataly bevestigt uw aanvraag persoonlijk,
              meestal binnen enkele uren.
            </p>
            <div className="flex flex-wrap gap-3">
              <OpenBookingButton variant="bronze" size="lg">
                Afspraak aanvragen
              </OpenBookingButton>
              <PillLink href={whatsappUrl()} external variant="outline" size="lg" className="font-normal">
                WhatsApp Nataly
              </PillLink>
            </div>
            <noscript>
              <p className="rounded-2xl border border-line bg-ivory p-4 text-sm">
                Voor online boeken is JavaScript nodig. U kunt ook bellen of een WhatsApp-bericht sturen naar{" "}
                <a href={site.phone.href}>{site.phone.display}</a>.
              </p>
            </noscript>
          </div>
        </main>
      </PageTransition>
      <MinimalFooter />
      <Suspense fallback={null}>
        <AutoOpenBooking />
      </Suspense>
    </div>
  );
}
