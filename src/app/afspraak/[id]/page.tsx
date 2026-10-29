import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { getService } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";
import { getBookingById, getRules } from "@/lib/booking/queries";
import { verifyManageToken } from "@/lib/booking/manage";
import { formatDay, formatTime } from "@/lib/time";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MinimalFooter } from "@/components/layout/SiteFooter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillLink } from "@/components/ui/PillLink";
import { CancelOwnBooking } from "./CancelOwnBooking";
import { PageTransition } from "@/components/motion/PageTransition";

export const metadata: Metadata = {
  title: "Uw afspraak",
  robots: { index: false, follow: false },
};

// Runs per request (after connection()), so reading the clock here is intended.
function hoursUntil(iso: string) {
  return (new Date(iso).getTime() - Date.now()) / 3_600_000;
}

const statusText: Record<string, { label: string; text: string }> = {
  pending: {
    label: "Aangevraagd",
    text: "Nataly bevestigt uw aanvraag persoonlijk, meestal binnen enkele uren. U krijgt daarover een e-mail.",
  },
  confirmed: { label: "Bevestigd", text: "Uw afspraak is bevestigd. Tot dan!" },
  declined: { label: "Niet mogelijk", text: "Nataly kon u op dit moment helaas niet ontvangen." },
  expired: {
    label: "Verlopen",
    text: "Deze aanvraag is verlopen omdat hij niet op tijd kon worden bevestigd.",
  },
  cancelled: { label: "Geannuleerd", text: "Deze afspraak is geannuleerd." },
};

async function Booking({ params, searchParams }: PageProps<"/afspraak/[id]">) {
  await connection();
  const [{ id }, { token }] = await Promise.all([params, searchParams]);
  const valid = typeof token === "string" && /^[0-9a-f-]{36}$/.test(id) && verifyManageToken(id, token);
  const booking = valid ? await getBookingById(id) : null;
  if (!booking) {
    return (
      <p className="text-muted">
        Deze link is ongeldig. Gebruik de link uit uw e-mail, of neem contact op via{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        .
      </p>
    );
  }

  const { rules } = await getRules();
  const service = getService(booking.service_slug);
  const status = statusText[booking.status] ?? statusText.cancelled;
  const active = booking.status === "pending" || booking.status === "confirmed";
  const hoursLeft = hoursUntil(booking.starts_at);
  const canCancel = active && hoursLeft >= rules.cancelCutoffHours;
  const isPast = hoursLeft < 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-tight font-normal">Uw afspraak</h1>
        <span className="rounded-full bg-chip px-3 py-1 text-sm text-bronze-darkest">{status.label}</span>
      </div>
      <p className="text-base text-muted">{isPast && active ? "Deze afspraak is voorbij." : status.text}</p>

      <dl className="flex flex-col gap-2 rounded-[22px] border border-line-soft bg-ivory p-5 text-[15px]">
        {(
          [
            ["Behandeling", service?.title ?? booking.service_slug],
            [
              "Wanneer",
              `${formatDay(booking.starts_at)}, ${formatTime(booking.starts_at)}–${formatTime(booking.ends_at)}`,
            ],
            ["Duur", `${booking.duration_min} minuten`],
            ["Prijs", `€${Number(booking.price_eur).toFixed(0)}`],
            ["Naam", `${booking.first_name} ${booking.last_name}`],
            ...(booking.status === "confirmed"
              ? [["Locatie", `${site.city} (adres staat in uw bevestigingsmail)`]]
              : []),
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <dt className="w-28 shrink-0 text-muted-2">{k}</dt>
            <dd className="first-letter:uppercase">{v}</dd>
          </div>
        ))}
      </dl>

      {canCancel && (
        <CancelOwnBooking id={booking.id} token={token as string} cutoffHours={rules.cancelCutoffHours} />
      )}
      {active && !canCancel && !isPast && (
        <p className="rounded-2xl border border-line bg-ivory p-4 text-sm text-muted">
          Online annuleren kan tot {rules.cancelCutoffHours} uur voor de afspraak. Kunt u onverwacht niet
          komen? Bel of stuur een WhatsApp-bericht naar <a href={site.phone.href}>{site.phone.display}</a>.
        </p>
      )}
      {!active && service && (
        <PillLink href={`/afspraak?dienst=${service.slug}`} variant="bronze" size="md" className="self-start">
          Nieuwe afspraak maken
        </PillLink>
      )}
    </>
  );
}

export default function OwnBookingPage(props: PageProps<"/afspraak/[id]">) {
  return (
    <div className="overflow-x-clip">
      <SiteHeader />
      <PageTransition>
        <main id="main" className="px-[clamp(20px,5vw,64px)] pt-[clamp(48px,7vw,96px)]">
          <div className="mx-auto flex max-w-[620px] flex-col gap-5">
            <Eyebrow>Nataly Beauty Massages</Eyebrow>
            <Suspense fallback={<p className="text-muted">Laden…</p>}>
              <Booking {...props} />
            </Suspense>
          </div>
        </main>
      </PageTransition>
      <MinimalFooter />
    </div>
  );
}
