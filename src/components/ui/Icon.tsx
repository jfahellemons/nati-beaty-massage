import { cn } from "@/lib/cn";

export const icons = {
  arrow: "M7 17L17 7M8 7h9v9",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
  clock: "M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18z M12 7v5l3 2",
  sparkle: "M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  pin: "M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z M12 10m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0",
  instagram:
    "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z M12 8.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 1 1 0-7z M17.3 6.7h.01",
  info: "M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18z M12 11v5 M12 7.5h.01",
  quality: "M12 3l7 6-7 12-7-12z M5 9h14 M9.5 9L12 21l2.5-12 M9 3.5L9.5 9 M15 3.5L14.5 9",
  certified: "M12 3a6 6 0 1 1 0 12a6 6 0 1 1 0-12z M9.5 9l1.7 1.7L14.5 7.5 M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7",
  leaf: "M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z M5 19l9-9",
  heart: "M12 20s-7.5-4.5-7.5-10A4.2 4.2 0 0 1 12 7.5 4.2 4.2 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z",
} as const;

type IconProps = {
  /** A key of `icons`, or raw path data. */
  name?: keyof typeof icons;
  d?: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  /** Draws its outline when revealed (inside a `data-reveal` element). */
  draw?: boolean;
};

export function Icon({ name, d, size = 20, strokeWidth = 1.6, className, draw }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", draw && "icon-draw", className)}
    >
      <path d={d ?? (name ? icons[name] : "")} pathLength={draw ? 1 : undefined} />
    </svg>
  );
}

export function WhatsAppIcon({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.3 11.3 0 0 0 12.05.72C5.79.72.7 5.81.7 12.07c0 2 .52 3.95 1.52 5.67L.6 23.28l5.68-1.49a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.03z" />
    </svg>
  );
}
