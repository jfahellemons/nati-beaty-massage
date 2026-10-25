import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type PillVariant = "bronze" | "deep" | "ivory" | "outline" | "outline-soft" | "ghost-dark";
export type PillSize = "sm" | "md" | "lg";

const root: Record<PillVariant, string> = {
  bronze: "bg-bronze text-white hover:bg-bronze-deep hover:text-white",
  deep: "bg-bronze-deep text-white hover:bg-bronze-darker hover:text-white",
  ivory: "bg-ivory text-bronze-deep shadow-soft hover:text-bronze-darkest",
  outline: "border border-bronze bg-transparent text-bronze-deep hover:bg-chip-soft",
  "outline-soft": "border border-line-strong bg-transparent text-bronze-deep hover:bg-chip-soft",
  "ghost-dark": "border border-ivory/45 bg-ivory/5 text-ivory hover:bg-ivory/15 hover:text-ivory",
};

const circle: Record<PillVariant, string> = {
  bronze: "bg-ivory text-bronze-deep",
  deep: "bg-ivory text-bronze-deep",
  ivory: "bg-bronze-deep text-white",
  outline: "bg-bronze-deep text-white",
  "outline-soft": "bg-bronze-deep text-white",
  "ghost-dark": "border border-ivory/45 text-ivory",
};

const sizes: Record<PillSize, { root: string; circle: string; icon: number }> = {
  sm: { root: "gap-2.5 py-[5px] pr-[5px] pl-[18px] text-[13px]", circle: "size-[30px]", icon: 12 },
  md: { root: "gap-3 py-1.5 pr-1.5 pl-[22px] text-sm", circle: "size-[34px]", icon: 14 },
  lg: { root: "gap-3.5 py-[7px] pr-[7px] pl-[26px] text-[15px]", circle: "size-10", icon: 15 },
};

/** Class names for the design's signature pill button (label + arrow circle). */
export function pillClass(variant: PillVariant, size: PillSize, className?: string) {
  return cn(
    "inline-flex cursor-pointer items-center rounded-full font-medium whitespace-nowrap transition-colors duration-200",
    root[variant],
    sizes[size].root,
    className,
  );
}

export function PillContent({
  children,
  variant,
  size,
}: {
  children: React.ReactNode;
  variant: PillVariant;
  size: PillSize;
}) {
  return (
    <>
      {children}
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          sizes[size].circle,
          circle[variant],
        )}
      >
        <Icon name="arrow" size={sizes[size].icon} strokeWidth={2} />
      </span>
    </>
  );
}
