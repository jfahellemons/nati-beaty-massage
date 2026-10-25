import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export function CancellationNote({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[13px] leading-snug",
        tone === "light" ? "text-muted-2" : "text-on-dark",
        className,
      )}
    >
      <Icon
        name="info"
        size={16}
        className={cn("mt-px", tone === "light" ? "text-bronze-deep" : "text-sand")}
      />
      <span>{site.cancellationNote}</span>
    </p>
  );
}
