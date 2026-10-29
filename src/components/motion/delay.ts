import type { CSSProperties } from "react";

/** Inline delay for on-load animations (`animate-*`); also offsets nested effects like the eyebrow line. */
export function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms`, "--reveal-delay": `${ms}ms` } as CSSProperties;
}
