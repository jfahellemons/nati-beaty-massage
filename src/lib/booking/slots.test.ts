import { describe, expect, it } from "vitest";
import { localToDate } from "@/lib/time";
import { freeSlots, type SlotInput } from "./slots";

const settings = { slotStepMin: 15, bufferMin: 15, minNoticeHours: 12, windowDays: 60 };
const at = (date: string, time: string) => localToDate(date, time);

function input(overrides: Partial<SlotInput> = {}): SlotInput {
  return {
    date: "2026-11-10",
    durationMin: 60,
    hours: { opens: "09:00", closes: "12:00" },
    timeOff: [],
    busy: [],
    settings,
    now: at("2026-11-01", "08:00"),
    ...overrides,
  };
}

describe("freeSlots", () => {
  it("lists every quarter hour that still ends by closing time", () => {
    const slots = freeSlots(input());
    expect(slots[0]).toBe("09:00");
    expect(slots.at(-1)).toBe("11:00");
    expect(slots).toHaveLength(9);
  });

  it("returns nothing on a closed day", () => {
    expect(freeSlots(input({ hours: null }))).toEqual([]);
  });

  it("keeps the buffer after an existing booking (same rule as the database)", () => {
    // Existing 09:00–10:00, blocked until 10:15.
    const busy = [{ start: at("2026-11-10", "09:00"), end: at("2026-11-10", "10:15") }];
    const slots = freeSlots(input({ busy }));
    expect(slots).not.toContain("10:00");
    expect(slots).toContain("10:15");
  });

  it("keeps our own buffer before the next booking", () => {
    // Existing 11:00–11:45 (+15 buffer). A 60-min slot at 09:45 ends 10:45, buffer until 11:00: fits.
    // At 10:00 it ends 11:00 and its buffer runs to 11:15: overlaps.
    const busy = [{ start: at("2026-11-10", "11:00"), end: at("2026-11-10", "12:00") }];
    const slots = freeSlots(input({ busy }));
    expect(slots).toContain("09:45");
    expect(slots).not.toContain("10:00");
  });

  it("skips time off", () => {
    const timeOff = [{ start: at("2026-11-10", "10:00"), end: at("2026-11-10", "11:00") }];
    const slots = freeSlots(input({ timeOff }));
    expect(slots).toContain("09:00");
    expect(slots).not.toContain("09:15");
    expect(slots).toContain("11:00");
  });

  it("respects the minimum notice", () => {
    const slots = freeSlots(
      input({
        date: "2026-11-01",
        now: at("2026-10-31", "21:30"),
        hours: { opens: "09:00", closes: "12:00" },
      }),
    );
    // now + 12 h = 09:30
    expect(slots[0]).toBe("09:30");
  });

  it("respects the booking window and past dates", () => {
    expect(freeSlots(input({ date: "2027-01-15" }))).toEqual([]);
    expect(freeSlots(input({ date: "2026-10-30" }))).toEqual([]);
  });

  it("uses wall-clock times on the day summer time ends (25 Oct 2026)", () => {
    const slots = freeSlots(
      input({
        date: "2026-10-25",
        now: at("2026-10-20", "08:00"),
        hours: { opens: "01:00", closes: "05:00" },
      }),
    );
    // 02:00–03:00 happens twice that night; every local start is listed once.
    expect(slots[0]).toBe("01:00");
    expect(slots.at(-1)).toBe("04:00");
    expect(new Set(slots).size).toBe(slots.length);
    expect(at("2026-10-25", "09:00").toISOString()).toBe("2026-10-25T08:00:00.000Z");
  });

  it("uses wall-clock times on the day summer time starts (29 Mar 2026)", () => {
    expect(at("2026-03-29", "09:00").toISOString()).toBe("2026-03-29T07:00:00.000Z");
    const slots = freeSlots(input({ date: "2026-03-29", now: at("2026-03-20", "08:00") }));
    expect(slots[0]).toBe("09:00");
  });
});
