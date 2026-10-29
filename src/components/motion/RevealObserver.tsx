"use client";

import { useEffect } from "react";

const STAGGER_MS = 80;
const MAX_STAGGER = 6;

declare global {
  interface Window {
    __revealReady?: boolean;
  }
}

/**
 * Plays `[data-reveal]` elements once, when they scroll into view (styles in globals.css).
 * Elements that come into view together are staggered top-to-bottom, left-to-right.
 * Inactive without `html[data-motion]` (reduced motion, or the inline script didn't run).
 */
export function RevealObserver() {
  useEffect(() => {
    window.__revealReady = true;
    const root = document.documentElement;
    if (!root.hasAttribute("data-motion")) return;

    const io = new IntersectionObserver(
      (entries) => {
        const arriving = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ({ el: e.target as HTMLElement, rect: e.boundingClientRect }))
          .sort((a, b) => a.rect.top - b.rect.top || a.rect.left - b.rect.left);
        arriving.forEach(({ el }, i) => {
          el.style.setProperty("--reveal-delay", `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`);
          el.setAttribute("data-revealed", "");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    const scan = () =>
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    // Streamed sections and client navigations add new elements later.
    const mo = new MutationObserver(scan);

    // Start once hydration is done: marking elements React hasn't hydrated yet causes mismatches.
    let idle = 0;
    const start = () => {
      idle = window.setTimeout(() => {
        scan();
        mo.observe(document.body, { childList: true, subtree: true });
      }, 150);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      clearTimeout(idle);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
