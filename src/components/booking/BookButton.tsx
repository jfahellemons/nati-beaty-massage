"use client";

import Link from "next/link";
import { PillContent, pillClass, type PillSize, type PillVariant } from "@/components/ui/pill";
import { useBooking } from "./BookingProvider";

type Common = {
  children: React.ReactNode;
  className?: string;
  /** Render as the design's pill button. Omit for a plain text link. */
  variant?: PillVariant;
  size?: PillSize;
};

function Content({ children, variant, size }: Pick<Common, "children" | "variant" | "size">) {
  return variant ? (
    <PillContent variant={variant} size={size ?? "sm"}>
      {children}
    </PillContent>
  ) : (
    <>{children}</>
  );
}

/** Books one service: opens the booking dialog at the duration/date step. */
export function BookButton({ slug, children, className, variant, size = "sm" }: Common & { slug: string }) {
  const { book } = useBooking();
  return (
    <Link
      href={`/afspraak?dienst=${slug}`}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        book(slug);
      }}
      aria-haspopup="dialog"
      className={variant ? pillClass(variant, size, className) : className}
    >
      <Content variant={variant} size={size}>
        {children}
      </Content>
    </Link>
  );
}

/** Generic "Boek een Sessie" CTA: opens the booking dialog at the service step. */
export function OpenBookingButton({ children, className, variant, size = "md" }: Common) {
  const { openPicker } = useBooking();
  return (
    <Link
      href="/afspraak"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        openPicker();
      }}
      aria-haspopup="dialog"
      className={variant ? pillClass(variant, size, className) : className}
    >
      <Content variant={variant} size={size}>
        {children}
      </Content>
    </Link>
  );
}
