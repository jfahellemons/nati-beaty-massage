"use client";

import Link from "next/link";
import { calUrl } from "@/content/site";
import { PillContent, pillClass, type PillSize, type PillVariant } from "@/components/ui/pill";
import { useBooking } from "./BookingProvider";

type Common = {
  children: React.ReactNode;
  className?: string;
  /** Render as the design's pill button. Omit for a plain text link. */
  variant?: PillVariant;
  size?: PillSize;
};

/**
 * Books one service. A real link to the hosted Cal.com page, so it also works
 * without JavaScript; enhanced to open the Cal.com popup in place.
 */
export function BookButton({ slug, children, className, variant, size = "sm" }: Common & { slug: string }) {
  const { book, warm } = useBooking();
  return (
    <a
      href={calUrl(slug)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        book(slug);
      }}
      onPointerEnter={warm}
      onFocus={warm}
      className={variant ? pillClass(variant, size, className) : className}
    >
      {variant ? (
        <PillContent variant={variant} size={size}>
          {children}
        </PillContent>
      ) : (
        children
      )}
    </a>
  );
}

/**
 * Generic "Boek een Sessie" CTA: opens the service picker. Without JavaScript
 * it falls back to the services section.
 */
export function OpenBookingButton({ children, className, variant, size = "md" }: Common) {
  const { openPicker, warm } = useBooking();
  return (
    <Link
      href="/#behandelingen"
      onClick={(e) => {
        e.preventDefault();
        openPicker();
      }}
      onPointerEnter={warm}
      onFocus={warm}
      aria-haspopup="dialog"
      className={variant ? pillClass(variant, size, className) : className}
    >
      {variant ? (
        <PillContent variant={variant} size={size}>
          {children}
        </PillContent>
      ) : (
        children
      )}
    </Link>
  );
}
