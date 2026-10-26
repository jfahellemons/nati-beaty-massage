"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;
function loadTurnstile() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile (invisible for most visitors). Rendered explicitly so it also
 * works inside dialogs that open after page load. Adds a hidden `cf-turnstile-response` field.
 * Change `resetKey` to get a fresh token (tokens are single-use).
 */
export function Turnstile({ siteKey, resetKey }: { siteKey?: string; resetKey?: unknown }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let id: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !ref.current) return;
        id = api.render(ref.current, { sitekey: siteKey, language: "nl", size: "flexible" });
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, [siteKey, resetKey]);

  if (!siteKey) return null;
  return <div ref={ref} />;
}
