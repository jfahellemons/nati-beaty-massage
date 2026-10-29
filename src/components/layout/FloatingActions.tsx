"use client";

import { useEffect, useRef, useState } from "react";
import { site, whatsappUrl } from "@/content/site";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { OpenBookingButton } from "@/components/booking/BookButton";
import { delay } from "@/components/motion/delay";

/**
 * Sticky booking bar on phones (home page). Slides in once the hero's own buttons
 * (`#hero-cta`) have scrolled away, so there are never two "Boek" buttons on screen.
 */
export function MobileCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("hero-cta");
    if (!target) {
      queueMicrotask(() => setShow(true));
      return;
    }
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting));
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Lets the WhatsApp button move up to make room (see WhatsAppFab).
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-cta-bar", show);
    return () => root.removeAttribute("data-cta-bar");
  }, [show]);

  return (
    <div
      inert={!show}
      className={cn(
        "fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-60 flex items-center justify-between gap-3 rounded-full bg-espresso/94 py-2 pr-2 pl-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)] backdrop-blur-md transition-[translate,opacity] duration-500 ease-soft md:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[calc(100%+24px)] opacity-0",
      )}
    >
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] text-ivory">{site.name}</span>
        <span className="text-[11px] text-sand-muted">{site.city}</span>
      </span>
      <OpenBookingButton className="flex h-[46px] items-center rounded-full bg-bronze px-[22px] text-sm font-medium text-white transition-[background-color,scale] duration-200 hover:bg-bronze-deep hover:text-white active:scale-[0.98]">
        Boek een Sessie
      </OpenBookingButton>
    </div>
  );
}

/**
 * Floating WhatsApp button. `raised` makes room for the mobile booking bar while it's visible.
 * Gives one soft pulse after 8 s, once per visit.
 */
export function WhatsAppFab({ raised = false }: { raised?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("wa-pulsed")) return;
      sessionStorage.setItem("wa-pulsed", "1");
    } catch {
      return;
    }
    ref.current?.setAttribute("data-pulse", "");
  }, []);

  return (
    <a
      ref={ref}
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Stuur een WhatsApp-bericht"
      style={delay(600)}
      className={cn(
        "wa-pulse fixed right-5 bottom-6 z-70 flex size-[58px] animate-fade-up items-center justify-center rounded-full bg-bronze text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-[translate,scale,background-color] duration-500 ease-soft hover:scale-106 hover:bg-bronze-deep hover:text-white",
        raised && "max-md:[html[data-cta-bar]_&]:-translate-y-[calc(62px+env(safe-area-inset-bottom))]",
      )}
    >
      <WhatsAppIcon />
    </a>
  );
}
