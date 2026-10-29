"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

const weekdays = ["ma", "di", "wo", "do", "vr", "za", "zo"];
const monthName = new Intl.DateTimeFormat("nl-NL", { month: "long", year: "numeric", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

type Props = {
  /** "YYYY-MM" */
  month: string;
  available: Set<string>;
  loading: boolean;
  selected: string | null;
  canPrev: boolean;
  canNext: boolean;
  onMonth: (delta: number) => void;
  onSelect: (date: string) => void;
};

export function MonthCalendar({
  month,
  available,
  loading,
  selected,
  canPrev,
  canNext,
  onMonth,
  onSelect,
}: Props) {
  // Days slide in from the side of the arrow that was pressed.
  const [shownMonth, setShownMonth] = useState(month);
  const [direction, setDirection] = useState<"forward" | "back" | null>(null);
  if (month !== shownMonth) {
    setShownMonth(month);
    setDirection(month > shownMonth ? "forward" : "back");
  }

  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const offset = (first.getUTCDay() + 6) % 7; // Monday first

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonth(-1)}
          disabled={!canPrev}
          aria-label="Vorige maand"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory disabled:cursor-default disabled:opacity-30"
        >
          <Icon name="arrow" size={14} strokeWidth={2} className="-rotate-135" />
        </button>
        <span className="font-serif text-xl first-letter:uppercase" aria-live="polite">
          {monthName.format(first)}
        </span>
        <button
          type="button"
          onClick={() => onMonth(1)}
          disabled={!canNext}
          aria-label="Volgende maand"
          className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory disabled:cursor-default disabled:opacity-30"
        >
          <Icon name="arrow" size={14} strokeWidth={2} className="rotate-45" />
        </button>
      </div>

      <div
        key={month}
        role="grid"
        aria-busy={loading}
        className={cn(
          "grid grid-cols-7 gap-1 text-center transition-opacity duration-300",
          loading && "opacity-50",
          direction === "forward" && "animate-step-forward",
          direction === "back" && "animate-step-back",
        )}
      >
        {weekdays.map((d) => (
          <span key={d} role="columnheader" className="py-1 text-xs text-muted-2">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          const isAvailable = available.has(date);
          const isSelected = selected === date;
          return (
            <button
              key={date}
              type="button"
              role="gridcell"
              disabled={!isAvailable || loading}
              aria-selected={isSelected}
              aria-label={`${fullDate.format(new Date(`${date}T12:00:00Z`))}${isAvailable ? "" : ", niet beschikbaar"}`}
              onClick={() => onSelect(date)}
              className={cn(
                "flex aspect-square min-h-11 items-center justify-center rounded-full text-[15px] transition-colors",
                isAvailable
                  ? "cursor-pointer bg-chip-soft font-medium text-ink hover:bg-chip"
                  : "cursor-default text-muted-2/50 line-through decoration-transparent",
                isSelected && "bg-bronze-deep text-white hover:bg-bronze-deep",
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
