import { localDateKey, localToDate } from "@/lib/time";

export type SlotSettings = {
  slotStepMin: number;
  bufferMin: number;
  minNoticeHours: number;
  windowDays: number;
};

export type Range = { start: Date; end: Date };

export type SlotInput = {
  /** Local date "YYYY-MM-DD" (Europe/Amsterdam). */
  date: string;
  durationMin: number;
  /** Opening hours for that weekday as "HH:MM"; null when closed. */
  hours: { opens: string; closes: string } | null;
  /** Blocked periods (days off, holidays). */
  timeOff: Range[];
  /** Existing pending/confirmed bookings: `end` already includes their buffer (blocked_until). */
  busy: Range[];
  settings: SlotSettings;
  now: Date;
};

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const overlaps = (a: Range, b: Range) => a.start < b.end && a.end > b.start;

/** Last local date that can still be booked. */
export function lastBookableDate(settings: SlotSettings, now: Date) {
  return localDateKey(new Date(now.getTime() + settings.windowDays * 24 * 60 * 60_000));
}

/**
 * Free start times ("HH:MM", local) for one day. Mirrors the database rules:
 * the appointment plus its buffer may not overlap another booking (the database's
 * exclusion constraint enforces the same), it must end by closing time, may not
 * touch time off, and must respect the minimum notice and booking window.
 * Candidates are walked in local wall-clock time, so summer/winter time days work.
 */
export function freeSlots(input: SlotInput): string[] {
  const { date, durationMin, hours, timeOff, busy, settings, now } = input;
  if (!hours) return [];
  if (date < localDateKey(now) || date > lastBookableDate(settings, now)) return [];

  const earliest = new Date(now.getTime() + settings.minNoticeHours * 60 * 60_000);
  const open = toMinutes(hours.opens);
  const close = toMinutes(hours.closes);
  const slots: string[] = [];

  for (let m = open; m + durationMin <= close; m += settings.slotStepMin) {
    const time = toHHMM(m);
    const start = localToDate(date, time);
    if (start < earliest) continue;
    const end = new Date(start.getTime() + durationMin * 60_000);
    const blockedUntil = new Date(end.getTime() + settings.bufferMin * 60_000);

    if (busy.some((b) => overlaps({ start, end: blockedUntil }, b))) continue;
    if (timeOff.some((t) => overlaps({ start, end }, t))) continue;
    slots.push(time);
  }
  return slots;
}
