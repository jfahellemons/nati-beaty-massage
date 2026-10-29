import { ViewTransition } from "react";

/** Soft cross-fade of the page content on navigation (`.page` styles in globals.css). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
