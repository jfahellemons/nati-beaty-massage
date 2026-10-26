import { TZDate } from "@date-fns/tz";
import { addDays } from "date-fns";

/** All times are stored in UTC and shown/entered in the salon's timezone. */
export const TZ = "Europe/Amsterdam";

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("nl-NL", { timeZone: TZ, ...options });

const timeFmt = fmt({ hour: "2-digit", minute: "2-digit" });
const dayFmt = fmt({ weekday: "long", day: "numeric", month: "long" });
const shortDayFmt = fmt({ weekday: "short", day: "numeric", month: "short" });
const isoDateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const formatTime = (d: Date | string) => timeFmt.format(new Date(d));
/** "maandag 27 oktober" */
export const formatDay = (d: Date | string) => dayFmt.format(new Date(d));
/** "ma 27 okt" */
export const formatShortDay = (d: Date | string) => shortDayFmt.format(new Date(d));
/** Local calendar date as "YYYY-MM-DD". */
export const localDateKey = (d: Date | string) => isoDateFmt.format(new Date(d));

/** Start of the local day `offsetDays` from today, as a timezone-aware date. */
export function localDayStart(offsetDays = 0) {
  const now = TZDate.tz(TZ);
  return addDays(new TZDate(now.getFullYear(), now.getMonth(), now.getDate(), TZ), offsetDays);
}

/** Converts a local date ("YYYY-MM-DD") and time ("HH:mm") to a UTC Date. */
export function localToDate(date: string, time = "00:00") {
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(new TZDate(y, m - 1, d, h, min, TZ).getTime());
}

/** ISO weekday (1 = Monday … 7 = Sunday) of a local date ("YYYY-MM-DD"). */
export function isoWeekday(date: string) {
  const day = localToDate(date, "12:00");
  const js = new TZDate(day.getTime(), TZ).getDay();
  return js === 0 ? 7 : js;
}

export const weekdayNames = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];

/** "2 uur geleden", "gisteren", … */
export function timeAgo(d: Date | string, now = new Date()) {
  const minutes = Math.round((now.getTime() - new Date(d).getTime()) / 60000);
  if (minutes < 1) return "zojuist";
  if (minutes < 60) return `${minutes} min geleden`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} uur geleden`;
  const days = Math.round(hours / 24);
  return days === 1 ? "gisteren" : `${days} dagen geleden`;
}
