"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, startTransition } from "react";
import { track } from "@vercel/analytics";
import {
  durationLabel,
  getService,
  hasRange,
  lowestPrice,
  services,
  type Duration,
} from "@/content/services";
import { site } from "@/content/site";
import {
  getBookingWindow,
  getDaySlots,
  getMonthAvailability,
  requestBooking,
  type RequestState,
} from "@/lib/booking/actions";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { CancellationNote } from "@/components/ui/CancellationNote";
import { Turnstile } from "@/components/Turnstile";
import { MonthCalendar } from "./MonthCalendar";

type Step = "service" | "duration" | "date" | "time" | "details" | "review" | "done";
type Details = { firstName: string; lastName: string; email: string; phone: string; notes: string };

const titles: Record<Step, string> = {
  service: "Kies een behandeling",
  duration: "Kies de duur",
  date: "Kies een datum",
  time: "Kies een tijd",
  details: "Uw gegevens",
  review: "Controleer uw aanvraag",
  done: "Aanvraag verstuurd",
};

const longDate = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const fmtDate = (date: string) => longDate.format(new Date(`${date}T12:00:00Z`));
const durationsOf = (slug: string) =>
  Object.keys(getService(slug)?.prices ?? {})
    .map(Number)
    .sort((a, b) => a - b);

const field =
  "h-[52px] w-full rounded-[14px] border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-bronze aria-invalid:border-error";

function addMonths(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * The booking dialog: service → duration → date → time → details → review → done.
 * Free days and times come live from the shared database (rules set in the management app).
 */
export function BookingFlow({
  open,
  initialSlug,
  onClose,
}: {
  open: boolean;
  initialSlug: string | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const initialDurations = initialSlug ? durationsOf(initialSlug) : [];
  const [step, setStep] = useState<Step>(
    !initialSlug ? "service" : initialDurations.length > 1 ? "duration" : "date",
  );
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [duration, setDuration] = useState<number | null>(
    initialDurations.length === 1 ? initialDurations[0] : null,
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [bookingWindow, setBookingWindow] = useState<{ first: string; last: string } | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [available, setAvailable] = useState<Set<string>>(new Set());
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, submit, pending] = useActionState<RequestState, FormData>(requestBooking, { status: "idle" });

  const service = slug ? getService(slug) : undefined;
  const price = service && duration ? service.prices[duration as Duration] : undefined;

  // Open/close the native dialog.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // Booking window: needed for the calendar.
  useEffect(() => {
    if (!open || bookingWindow) return;
    let cancelled = false;
    getBookingWindow().then((w) => !cancelled && setBookingWindow(w));
    return () => {
      cancelled = true;
    };
  }, [open, bookingWindow]);

  // Free days for the visible month.
  const visibleMonth = month ?? bookingWindow?.first.slice(0, 7) ?? null;
  useEffect(() => {
    if (step !== "date" || !slug || !duration || !visibleMonth) return;
    let cancelled = false;
    startTransition(() => setLoadingMonth(true));
    getMonthAvailability(slug, duration, visibleMonth)
      .then((res) => !cancelled && setAvailable(new Set(res.available)))
      .finally(() => !cancelled && setLoadingMonth(false));
    return () => {
      cancelled = true;
    };
  }, [step, slug, duration, visibleMonth]);

  // Server answers.
  useEffect(() => {
    if (state.status === "success") {
      track("booking_requested", { service: slug ?? "" });
      startTransition(() => setStep("done"));
    } else if (state.status === "taken") {
      startTransition(() => {
        setNotice("Dit tijdstip is net bezet. Kies een ander tijdstip.");
        setTime(null);
        setSlots(null);
        setStep("time");
      });
      if (slug && duration && date) getDaySlots(slug, duration, date).then((r) => setSlots(r.slots));
    } else if (state.status === "error" && state.fieldErrors) {
      startTransition(() => setStep("details"));
    }
    if (state.status !== "idle" && state.status !== "success")
      startTransition(() => setAttempt((a) => a + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- react only to new server answers
  }, [state]);

  // Each step starts at the top, with focus on its title for screen readers.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    bodyRef.current?.querySelector<HTMLElement>("[data-step-title]")?.focus();
  }, [step]);

  function chooseService(s: string) {
    const ds = durationsOf(s);
    setSlug(s);
    setDuration(ds.length === 1 ? ds[0] : null);
    setDate(null);
    setTime(null);
    setStep(ds.length === 1 ? "date" : "duration");
  }

  function chooseDate(d: string) {
    setDate(d);
    setTime(null);
    setSlots(null);
    setNotice(null);
    setStep("time");
    if (slug && duration) getDaySlots(slug, duration, d).then((r) => setSlots(r.slots));
  }

  function back() {
    setNotice(null);
    const prev: Partial<Record<Step, Step>> = {
      duration: "service",
      date: slug && durationsOf(slug).length > 1 ? "duration" : "service",
      time: "date",
      details: "time",
      review: "details",
    };
    const to = prev[step];
    if (to) setStep(to);
  }

  function sendRequest() {
    const form = new FormData(document.getElementById("booking-review") as HTMLFormElement);
    form.set("service", slug ?? "");
    form.set("duration", String(duration ?? ""));
    form.set("date", date ?? "");
    form.set("time", time ?? "");
    for (const [k, v] of Object.entries(details)) form.set(k, v);
    form.set("consent", "on");
    startTransition(() => submit(form));
  }

  const fieldErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const summary = [
    service?.title,
    duration ? `${duration} min` : null,
    price !== undefined ? `€${price}` : null,
    date ? fmtDate(date) : null,
    time,
  ]
    .filter(Boolean)
    .join(" · ");

  const groups = slots
    ? [
        { label: "Ochtend", items: slots.filter((t) => t < "12:00") },
        { label: "Middag", items: slots.filter((t) => t >= "12:00" && t < "17:00") },
        { label: "Avond", items: slots.filter((t) => t >= "17:00") },
      ].filter((g) => g.items.length)
    : [];

  return (
    <dialog
      ref={ref}
      aria-labelledby="flow-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-3xl bg-cream p-0 text-ink shadow-modal md:m-auto md:max-h-[min(880px,calc(100dvh-48px))] md:max-w-[620px] md:rounded-[28px]"
    >
      <div className="flex max-h-[inherit] flex-col">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-line py-3.5 pr-4 pl-3">
          {step !== "service" && step !== "done" ? (
            <button
              type="button"
              onClick={back}
              aria-label="Vorige stap"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-chip-soft"
            >
              <Icon name="arrow" size={15} strokeWidth={2} className="-rotate-135" />
            </button>
          ) : (
            <span className="w-2" />
          )}
          <div className="flex flex-1 flex-col">
            <span className="text-[11px] tracking-[0.24em] text-bronze-deep uppercase">Afspraak maken</span>
            <h2
              id="flow-title"
              data-step-title
              tabIndex={-1}
              className="font-serif text-[26px] leading-tight outline-none"
            >
              {titles[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluiten"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory"
          >
            <Icon name="close" size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="flex flex-col gap-4 overflow-y-auto px-5 pt-5 pb-6 [-webkit-overflow-scrolling:touch] md:px-7"
        >
          {notice && (
            <p role="alert" className="rounded-[14px] border border-bronze/40 bg-chip-soft px-4 py-3 text-sm">
              {notice}
            </p>
          )}

          {step === "service" && (
            <>
              <p className="text-[15px] leading-relaxed text-muted">
                Kies een behandeling. Daarna kiest u de duur, datum en tijd. Nataly bevestigt uw aanvraag
                persoonlijk.
              </p>
              <ul className="flex flex-col gap-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => chooseService(s.slug)}
                      className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-[14px] border border-line bg-ivory px-3.5 py-2.5 text-left transition-colors hover:border-bronze hover:bg-chip-soft"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-chip text-bronze-deep">
                        <Icon d={s.icon} size={18} strokeWidth={1.4} />
                      </span>
                      <span className="flex flex-1 flex-col gap-0.5">
                        <span className="text-[15px] leading-tight">{s.title}</span>
                        <span className="text-xs text-muted-2">{durationLabel(s)}</span>
                      </span>
                      <span className="flex shrink-0 items-baseline gap-1 whitespace-nowrap">
                        {hasRange(s) && <span className="text-xs text-muted-2">vanaf</span>}
                        <span className="font-serif text-[19px]">€{lowestPrice(s)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === "duration" && service && (
            <>
              <p className="text-[15px] text-muted">{service.title}</p>
              <ul className="grid grid-cols-2 gap-2">
                {durationsOf(service.slug).map((d) => (
                  <li key={d}>
                    <button
                      type="button"
                      onClick={() => {
                        setDuration(d);
                        setDate(null);
                        setTime(null);
                        setStep("date");
                      }}
                      className={cn(
                        "flex w-full cursor-pointer flex-col items-center gap-1 rounded-[14px] border bg-ivory px-3 py-4 transition-colors hover:border-bronze hover:bg-chip-soft",
                        duration === d ? "border-bronze bg-chip-soft" : "border-line",
                      )}
                    >
                      <span className="text-[15px]">{d} minuten</span>
                      <span className="font-serif text-2xl">€{service.prices[d as Duration]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === "date" &&
            (bookingWindow && visibleMonth ? (
              <>
                <MonthCalendar
                  month={visibleMonth}
                  available={available}
                  loading={loadingMonth}
                  selected={date}
                  canPrev={visibleMonth > bookingWindow.first.slice(0, 7)}
                  canNext={visibleMonth < bookingWindow.last.slice(0, 7)}
                  onMonth={(delta) => setMonth(addMonths(visibleMonth, delta))}
                  onSelect={chooseDate}
                />
                {!loadingMonth && available.size === 0 && (
                  <p className="text-sm text-muted">
                    Geen vrije momenten deze maand.{" "}
                    {visibleMonth < bookingWindow.last.slice(0, 7) ? "Kijk in de volgende maand, of " : ""}
                    <a
                      href={`https://wa.me/${site.whatsapp.number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      stuur Nataly een WhatsApp-bericht
                    </a>
                    .
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted">Beschikbaarheid laden…</p>
            ))}

          {step === "time" && date && (
            <>
              <p className="text-[15px] text-muted first-letter:uppercase">{fmtDate(date)}</p>
              {slots === null ? (
                <p className="text-muted">Tijden laden…</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-muted">
                  Op deze dag zijn geen tijden meer vrij. Kies een andere datum.
                </p>
              ) : (
                groups.map((g) => (
                  <fieldset key={g.label} className="flex flex-col gap-2">
                    <legend className="mb-2 text-xs tracking-wide text-muted-2 uppercase">{g.label}</legend>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {g.items.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setTime(t);
                            setNotice(null);
                            setStep("details");
                          }}
                          aria-pressed={time === t}
                          className={cn(
                            "h-12 cursor-pointer rounded-[12px] border text-[15px] transition-colors hover:border-bronze hover:bg-chip-soft",
                            time === t
                              ? "border-bronze bg-bronze-deep text-white hover:bg-bronze-deep"
                              : "border-line bg-ivory",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))
              )}
            </>
          )}

          {step === "details" && (
            <form
              id="booking-details"
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("review");
              }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {(
                  [
                    ["firstName", "Voornaam", "given-name", "text"],
                    ["lastName", "Achternaam", "family-name", "text"],
                    ["email", "E-mailadres", "email", "email"],
                    ["phone", "Telefoonnummer", "tel", "tel"],
                  ] as const
                ).map(([name, label, autoComplete, type]) => (
                  <label key={name} className="flex flex-col gap-1.5">
                    <span className="text-[13px] font-medium">{label}*</span>
                    <input
                      name={name}
                      type={type}
                      required
                      autoComplete={autoComplete}
                      value={details[name]}
                      onChange={(e) => setDetails((d) => ({ ...d, [name]: e.target.value }))}
                      aria-invalid={!!fieldErrors[name]}
                      aria-describedby={fieldErrors[name] ? `${name}-error` : undefined}
                      className={field}
                    />
                    {fieldErrors[name] && (
                      <span id={`${name}-error`} className="text-[13px] text-error">
                        {fieldErrors[name]}
                      </span>
                    )}
                  </label>
                ))}
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium">Opmerkingen of wensen (optioneel)</span>
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={500}
                  value={details.notes}
                  onChange={(e) => setDetails((d) => ({ ...d, notes: e.target.value }))}
                  className={cn(field, "h-auto resize-y py-3")}
                />
                <span className="text-xs text-muted-2">
                  Vermeld hier geen medische gegevens; die bespreekt u liever persoonlijk.
                </span>
              </label>
            </form>
          )}

          {step === "review" && service && duration && date && time && (
            <form
              id="booking-review"
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                sendRequest();
              }}
            >
              <dl className="flex flex-col gap-1.5 rounded-[18px] border border-line-soft bg-ivory p-4 text-[15px]">
                {(
                  [
                    ["Behandeling", service.title],
                    ["Duur", `${duration} minuten`],
                    ["Wanneer", `${fmtDate(date)}, ${time}`],
                    ["Prijs", `€${price}`],
                    ["Naam", `${details.firstName} ${details.lastName}`],
                    ["Contact", `${details.email} · ${details.phone}`],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="w-28 shrink-0 text-muted-2">{k}</dt>
                    <dd className={k === "Wanneer" ? "first-letter:uppercase" : undefined}>{v}</dd>
                  </div>
                ))}
                {details.notes && (
                  <div className="flex gap-3">
                    <dt className="w-28 shrink-0 text-muted-2">Opmerking</dt>
                    <dd>{details.notes}</dd>
                  </div>
                )}
              </dl>
              <p className="text-sm leading-relaxed text-muted">
                Dit is een aanvraag: Nataly bevestigt deze persoonlijk, meestal binnen enkele uren. Door te
                versturen gaat u akkoord met de <Link href="/algemene-voorwaarden">algemene voorwaarden</Link>{" "}
                en het <Link href="/privacy">privacybeleid</Link>.
              </p>
              {/* Honeypot */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px"
              />
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} resetKey={attempt} />
              {state.status === "error" && state.message && (
                <p role="alert" className="text-sm text-error">
                  {state.message}
                </p>
              )}
            </form>
          )}

          {step === "done" && (
            <div role="status" className="flex flex-col items-start gap-4 py-2">
              <span className="flex size-14 items-center justify-center rounded-full bg-bronze-deep text-white">
                <Icon name="check" size={24} strokeWidth={2} />
              </span>
              <p className="font-serif text-[30px] leading-tight">Dank u, {details.firstName}.</p>
              <p className="text-[15px] leading-relaxed text-muted">
                Uw aanvraag voor <strong className="font-medium text-ink">{service?.title}</strong> op{" "}
                {date && fmtDate(date)} om {time} is verstuurd. Nataly bevestigt deze persoonlijk, meestal
                binnen enkele uren. U ontvangt een e-mail ter bevestiging van uw aanvraag.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="h-12 cursor-pointer rounded-full bg-bronze-deep px-7 text-[15px] font-medium text-white hover:bg-bronze-darker"
              >
                Sluiten
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== "done" && (
          <div className="flex shrink-0 flex-col gap-3 border-t border-line bg-ivory px-5 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom))] md:px-7 md:pb-4">
            {summary && <p className="truncate text-sm text-ink first-letter:uppercase">{summary}</p>}
            {step === "details" && (
              <button
                type="submit"
                form="booking-details"
                className="h-[50px] cursor-pointer rounded-full bg-bronze-deep text-[15px] font-medium text-white hover:bg-bronze-darker"
              >
                Volgende
              </button>
            )}
            {step === "review" && (
              <button
                type="submit"
                form="booking-review"
                disabled={pending}
                className="h-[50px] cursor-pointer rounded-full bg-bronze-deep text-[15px] font-medium text-white hover:bg-bronze-darker disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? "Versturen…" : "Aanvraag versturen"}
              </button>
            )}
            <CancellationNote />
          </div>
        )}
      </div>
    </dialog>
  );
}
