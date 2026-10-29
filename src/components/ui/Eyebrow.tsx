import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-3 self-start text-xs tracking-[0.24em] uppercase",
        tone === "light" ? "text-bronze-deep" : "text-sand-soft",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("eyebrow-line h-px w-7", tone === "light" ? "bg-bronze" : "bg-sand-soft")}
      />
      {children}
    </span>
  );
}

/** Italic serif accent used inside headings. */
export function Accent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-serif font-normal text-bronze-deep", className)}>{children}</span>;
}
