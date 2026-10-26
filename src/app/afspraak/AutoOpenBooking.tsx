"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getService } from "@/content/services";
import { useBooking } from "@/components/booking/BookingProvider";

/** Opens the booking dialog once when the page loads (for the service in ?dienst=, if any). */
export function AutoOpenBooking() {
  const params = useSearchParams();
  const { book, openPicker } = useBooking();
  const done = useRef(false);
  const dienst = params.get("dienst");

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const service = getService(dienst);
    if (service) book(service.slug);
    else openPicker();
  }, [dienst, book, openPicker]);

  return null;
}
