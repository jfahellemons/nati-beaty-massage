"use server";

import { z } from "zod";
import { getService, type Duration } from "@/content/services";
import { localDateKey, localToDate } from "@/lib/time";
import { clientIp, rateLimited, verifyTurnstile } from "@/lib/security";
import { freeSlots, lastBookableDate } from "./slots";
import { bookingDb, getBlocked, getBookingById, getRules, hoursFor } from "./queries";
import { verifyManageToken } from "./manage";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

function validChoice(slug: string, duration: number) {
  const service = getService(slug);
  const price = service?.prices[duration as Duration];
  return service && price !== undefined ? { service, price } : null;
}

/** Local dates in a month ("YYYY-MM") that have at least one free start time. */
export async function getMonthAvailability(slug: string, duration: number, month: string) {
  if (!validChoice(slug, duration) || !/^\d{4}-\d{2}$/.test(month)) return { available: [] as string[] };
  const now = new Date();
  const { rules, hours } = await getRules();
  const today = localDateKey(now);
  const last = lastBookableDate(rules, now);

  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const dates = Array.from(
    { length: daysInMonth },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  ).filter((d) => d >= today && d <= last);
  if (!dates.length) return { available: [] };

  const { busy, timeOff } = await getBlocked(dates[0], dates[dates.length - 1]);
  const available = dates.filter(
    (date) =>
      freeSlots({
        date,
        durationMin: duration,
        hours: hoursFor(hours, date),
        busy,
        timeOff,
        settings: rules,
        now,
      }).length > 0,
  );
  return { available };
}

export async function getDaySlots(slug: string, duration: number, date: string) {
  if (!validChoice(slug, duration) || !dateRe.test(date)) return { slots: [] as string[] };
  const { rules, hours } = await getRules();
  const { busy, timeOff } = await getBlocked(date, date);
  return {
    slots: freeSlots({
      date,
      durationMin: duration,
      hours: hoursFor(hours, date),
      busy,
      timeOff,
      settings: rules,
      now: new Date(),
    }),
  };
}

/** Booking window for the calendar: first and last bookable local date. */
export async function getBookingWindow() {
  const now = new Date();
  const { rules } = await getRules();
  return { first: localDateKey(now), last: lastBookableDate(rules, now) };
}

const requestSchema = z.object({
  service: z.string(),
  duration: z.coerce.number().int(),
  date: z.string().regex(dateRe),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: z.string().trim().min(1, { error: "Vul uw voornaam in." }).max(60),
  lastName: z.string().trim().min(1, { error: "Vul uw achternaam in." }).max(80),
  email: z.email({ error: "Vul een geldig e-mailadres in." }).max(254),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{8,20}$/, { error: "Vul een geldig telefoonnummer in." }),
  notes: z.string().trim().max(500, { error: "Gebruik maximaal 500 tekens." }),
  consent: z.literal("on", { error: "Ga akkoord met de voorwaarden en het privacybeleid." }),
});

type Field = keyof z.infer<typeof requestSchema>;

export type RequestState =
  | { status: "idle" }
  | { status: "success"; id: string }
  /** The time was taken in the meantime: pick another one. */
  | { status: "taken" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<Field, string>> };

export async function requestBooking(_prev: RequestState, formData: FormData): Promise<RequestState> {
  // Honeypot: bots fill every field. Pretend success without storing anything.
  if (formData.get("website")) return { status: "success", id: "ok" };

  const parsed = requestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Partial<Record<Field, string>> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as Field] ??= issue.message;
    return { status: "error", fieldErrors };
  }
  const input = parsed.data;
  const choice = validChoice(input.service, input.duration);
  if (!choice) return { status: "error", message: "Kies een behandeling en duur." };

  const ip = await clientIp();
  if (rateLimited(`booking:${ip}`, 5, 60 * 60_000)) {
    return {
      status: "error",
      message: "U heeft al een paar aanvragen verstuurd. Neem contact op via WhatsApp of telefoon.",
    };
  }
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
    return { status: "error", message: "De beveiligingscontrole is mislukt. Probeer het opnieuw." };
  }

  // Re-check against the current rules (the screen may be out of date).
  const { slots } = await getDaySlots(input.service, input.duration, input.date);
  if (!slots.includes(input.time)) return { status: "taken" };

  const { data, error } = await bookingDb()
    .from("bookings")
    .insert({
      service_slug: choice.service.slug,
      duration_min: input.duration,
      price_eur: choice.price,
      starts_at: localToDate(input.date, input.time).toISOString(),
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      notes: input.notes || null,
      status: "pending",
      source: "website",
    })
    .select("id")
    .single();

  // Someone else took it at the same moment: the database's no-overlap rule refused it.
  if (error?.code === "23P01") return { status: "taken" };
  if (error || !data) {
    console.error("requestBooking: insert failed", error);
    return {
      status: "error",
      message: "Er ging iets mis. Probeer het opnieuw of stuur Nataly een WhatsApp-bericht.",
    };
  }
  return { status: "success", id: data.id };
}

export type CancelState = { status: "idle" | "done" | "error"; message?: string };

/** Client cancels their own booking via the link in their email (until the cut-off). */
export async function cancelOwnBooking(_prev: CancelState, formData: FormData): Promise<CancelState> {
  const id = String(formData.get("id") ?? "");
  const token = String(formData.get("token") ?? "");
  if (!z.uuid().safeParse(id).success || !verifyManageToken(id, token)) {
    return { status: "error", message: "Deze link is ongeldig." };
  }
  const booking = await getBookingById(id);
  if (!booking || !["pending", "confirmed"].includes(booking.status)) {
    return { status: "error", message: "Deze afspraak kan niet meer worden geannuleerd." };
  }
  const { rules } = await getRules();
  const hoursLeft = (new Date(booking.starts_at).getTime() - Date.now()) / 3_600_000;
  if (hoursLeft < rules.cancelCutoffHours) {
    return {
      status: "error",
      message: `Online annuleren kan tot ${rules.cancelCutoffHours} uur voor de afspraak. Neem contact op via WhatsApp of bel 06 1980 0612.`,
    };
  }

  const { data, error } = await bookingDb()
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString(), cancelled_by: "client" })
    .eq("id", id)
    .in("status", ["pending", "confirmed"])
    .select("id");
  if (error || !data.length)
    return { status: "error", message: "Annuleren is mislukt. Probeer het opnieuw." };
  return { status: "done", message: "Uw afspraak is geannuleerd. U ontvangt een bevestiging per e-mail." };
}
