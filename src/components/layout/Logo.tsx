import Image from "next/image";
import logoMark from "@/assets/images/logo-n.png";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** "N" mark + "Nataly / beauty massages" wordmark. Colours are inherited from the parent. */
export function Logo({
  size = "md",
  nameClassName,
  subClassName,
}: {
  size?: "md" | "lg";
  nameClassName?: string;
  subClassName?: string;
}) {
  const mark = size === "lg" ? 52 : 46;
  return (
    <span className="flex items-center gap-3">
      <Image src={logoMark} alt="" width={mark} height={Math.round((mark * 338) / 375)} loading="eager" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif font-medium tracking-[0.01em]",
            size === "lg" ? "text-[30px]" : "text-[27px]",
            nameClassName,
          )}
        >
          {site.shortName}
        </span>
        <span className={cn("mt-1 text-[10px] tracking-[0.32em] uppercase", subClassName)}>
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
