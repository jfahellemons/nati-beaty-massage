"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { BookingFlow } from "./BookingFlow";

type BookingContextValue = {
  /** Open the booking dialog at the service step (generic "Boek een Sessie" CTAs). */
  openPicker: () => void;
  /** Open the booking dialog for one service. */
  book: (slug: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  // `session` remounts the flow on every open, so it always starts fresh.
  const [state, setState] = useState<{ open: boolean; slug: string | null; session: number }>({
    open: false,
    slug: null,
    session: 0,
  });

  const openPicker = useCallback(
    () => setState((s) => ({ open: true, slug: null, session: s.session + 1 })),
    [],
  );
  const book = useCallback(
    (slug: string) => setState((s) => ({ open: true, slug, session: s.session + 1 })),
    [],
  );
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <BookingContext.Provider value={{ openPicker, book }}>
      {children}
      {state.session > 0 && (
        <BookingFlow key={state.session} open={state.open} initialSlug={state.slug} onClose={close} />
      )}
    </BookingContext.Provider>
  );
}
