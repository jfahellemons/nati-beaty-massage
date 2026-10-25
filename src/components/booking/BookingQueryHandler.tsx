"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getService } from "@/content/services";
import { useBooking } from "./BookingProvider";

/** `?boek=<slug>` opens that service's booking; `?boek` alone opens the picker. */
export function BookingQueryHandler() {
  const params = useSearchParams();
  const { book, openPicker } = useBooking();
  const boek = params.get("boek");

  useEffect(() => {
    if (boek === null) return;
    const service = getService(boek);
    if (service) book(service.slug);
    else openPicker();
  }, [boek, book, openPicker]);

  return null;
}
