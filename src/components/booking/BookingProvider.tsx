"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { calUrl, site } from "@/content/site";
import { ServicePicker } from "./ServicePicker";

// The embed's own types reference an unpublished package, so keep ours minimal.
type CalApi = (action: string, payload?: unknown) => void;

type BookingContextValue = {
  /** Open the designed service picker (generic "Boek een Sessie" CTAs). */
  openPicker: () => void;
  /** Open the Cal.com booking popup for one service. */
  book: (slug: string) => void;
  /** Start loading the Cal.com embed early (hover/focus on a booking trigger). */
  warm: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const calPromise = useRef<Promise<CalApi> | null>(null);

  const loadCal = useCallback(() => {
    if (!calPromise.current) {
      calPromise.current = import("@calcom/embed-react").then(async ({ getCalApi }) => {
        const cal = (await getCalApi({ namespace: site.cal.namespace })) as unknown as CalApi;
        cal("ui", {
          theme: "light",
          cssVarsPerTheme: { light: { "cal-brand": site.cal.brandColor } },
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        const onBooked = () => {
          setToast("Uw aanvraag is verstuurd. Nataly bevestigt deze zo snel mogelijk.");
          track("booking_requested");
        };
        cal("on", { action: "bookingSuccessfulV2", callback: onBooked });
        return cal;
      });
      // A failed load must not block later retries.
      calPromise.current.catch(() => {
        calPromise.current = null;
      });
    }
    return calPromise.current;
  }, []);

  const book = useCallback(
    (slug: string) => {
      setPickerOpen(false);
      loadCal()
        .then((cal) =>
          cal("modal", { calLink: `${site.cal.username}/${slug}`, config: { layout: "month_view" } }),
        )
        .catch(() => {
          // Embed blocked or offline: fall back to the hosted booking page.
          window.location.href = calUrl(slug);
        });
    },
    [loadCal],
  );

  const openPicker = useCallback(() => setPickerOpen(true), []);
  const warm = useCallback(() => {
    void loadCal().catch(() => {});
  }, [loadCal]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 8000);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <BookingContext.Provider value={{ openPicker, book, warm }}>
      {children}
      <ServicePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={book} onWarm={warm} />
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-3 top-3 z-[200] flex justify-center"
      >
        {toast && (
          <p className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-ink px-5 py-4 text-sm leading-snug text-ivory shadow-modal">
            {toast}
            <button
              type="button"
              onClick={() => setToast(null)}
              className="-my-1 -mr-2 shrink-0 cursor-pointer rounded-full px-2 py-1 text-sand"
              aria-label="Melding sluiten"
            >
              ✕
            </button>
          </p>
        )}
      </div>
    </BookingContext.Provider>
  );
}
