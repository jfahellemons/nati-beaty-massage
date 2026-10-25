"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/cn";
import { OpenBookingButton } from "@/components/booking/BookButton";
import { Logo } from "./Logo";

/**
 * `overlay`: transparent over the dark hero until the page scrolls (home).
 * Otherwise the header is always solid (subpages).
 */
export function SiteHeader({ overlay = false, current }: { overlay?: boolean; current?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlay || !sentinel.current) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [overlay]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = !overlay || scrolled || menuOpen;

  return (
    <>
      {overlay && (
        <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute top-0 h-10 w-px" />
      )}
      <header
        data-solid={solid}
        className={cn(
          "inset-x-0 top-0 z-50 border-b backdrop-blur-[14px] transition-[background-color,border-color] duration-300",
          overlay ? "fixed" : "sticky",
          solid ? "border-line bg-cream/92" : "border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-[clamp(20px,4vw,48px)] transition-[padding] duration-300",
            solid ? "py-3" : "py-[22px]",
          )}
        >
          <Link
            href="/"
            aria-label={`${site.name}, naar de homepage`}
            className={solid ? "text-ink" : "text-ivory"}
          >
            <Logo subClassName={solid ? "text-bronze-deep" : "text-sand-soft"} />
          </Link>

          <div className="hidden items-center gap-3 md:flex">
            <nav
              aria-label="Hoofdmenu"
              className={cn(
                "flex items-center gap-1 rounded-full border p-1.5",
                solid ? "border-line bg-ink/4" : "border-ivory/22 bg-ivory/10",
              )}
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current === item.href ? "page" : undefined}
                  className={cn(
                    "rounded-full px-[18px] py-2.5 text-sm transition-colors hover:bg-bronze/18",
                    solid ? "text-ink hover:text-ink" : "text-ivory hover:text-ivory",
                    current === item.href && "bg-bronze/18",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <OpenBookingButton variant="ivory" size="md">
              Boek een Sessie
            </OpenBookingButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
            className={cn(
              "flex size-[46px] cursor-pointer flex-col items-center justify-center gap-[5px] rounded-full border md:hidden",
              solid ? "border-line bg-ink/4" : "border-ivory/22 bg-ivory/10",
            )}
          >
            <span
              className={cn(
                "block h-[1.5px] w-[18px] transition-transform",
                solid ? "bg-ink" : "bg-ivory",
                menuOpen && "translate-y-[3.25px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-[1.5px] w-[18px] transition-transform",
                solid ? "bg-ink" : "bg-ivory",
                menuOpen && "-translate-y-[3.25px] -rotate-45",
              )}
            />
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Mobiel menu"
            className="flex flex-col border-t border-line bg-cream px-5 pt-3 pb-6 md:hidden"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-line px-1 py-4 text-lg text-ink hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
