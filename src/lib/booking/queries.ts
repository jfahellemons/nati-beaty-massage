import "server-only";
import { getSupabase } from "@/lib/supabase";
import type { Tables } from "@/lib/database.types";
import { isoWeekday, localToDate } from "@/lib/time";
import type { Range, SlotSettings } from "./slots";

export type Booking = Tables<"bookings">;

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export type BookingRules = SlotSettings & { cancelCutoffHours: number };

/** Settings and opening hours change in the management app; always read them live. */
export async function getRules(): Promise<{
  rules: BookingRules;
  hours: Map<number, { opens: string; closes: string }>;
}> {
  const [settings, hours] = await Promise.all([
    db().from("booking_settings").select("*").single(),
    db().from("opening_hours").select("*"),
  ]);
  if (settings.error || hours.error) throw new Error("Loading booking rules failed");
  const s = settings.data;
  return {
    rules: {
      slotStepMin: s.slot_step_min,
      bufferMin: s.buffer_min,
      minNoticeHours: s.min_notice_hours,
      windowDays: s.window_days,
      cancelCutoffHours: s.cancel_cutoff_hours,
    },
    hours: new Map(
      hours.data.map((h) => [h.weekday, { opens: h.opens.slice(0, 5), closes: h.closes.slice(0, 5) }]),
    ),
  };
}

/** Occupied periods (incl. buffer) and time off between two local dates, inclusive. */
export async function getBlocked(
  fromDate: string,
  toDate: string,
): Promise<{ busy: Range[]; timeOff: Range[] }> {
  const from = localToDate(fromDate, "00:00").toISOString();
  const to = new Date(localToDate(toDate, "00:00").getTime() + 24 * 60 * 60_000).toISOString();
  const [bookings, timeOff] = await Promise.all([
    db()
      .from("bookings")
      .select("starts_at, blocked_until")
      .in("status", ["pending", "confirmed"])
      .lt("starts_at", to)
      .gt("blocked_until", from),
    db().from("time_off").select("starts_at, ends_at").lt("starts_at", to).gt("ends_at", from),
  ]);
  if (bookings.error || timeOff.error) throw new Error("Loading availability failed");
  return {
    busy: bookings.data.map((b) => ({ start: new Date(b.starts_at), end: new Date(b.blocked_until) })),
    timeOff: timeOff.data.map((t) => ({ start: new Date(t.starts_at), end: new Date(t.ends_at) })),
  };
}

export function hoursFor(hours: Map<number, { opens: string; closes: string }>, date: string) {
  return hours.get(isoWeekday(date)) ?? null;
}

export async function getBookingById(id: string) {
  const { data } = await db().from("bookings").select("*").eq("id", id).maybeSingle();
  return data;
}

export { db as bookingDb };
