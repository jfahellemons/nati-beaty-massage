import { cn } from "@/lib/cn";

export const STAR_PATH =
  "M12 2.8l2.75 5.84 6.38.78-4.7 4.38 1.2 6.32L12 17.03l-5.63 3.09 1.2-6.32-4.7-4.38 6.38-.78z";

export function Stars({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span role="img" aria-label={`${rating} van 5 sterren`} className={cn("flex gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={STAR_PATH}
            fill={n <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}
