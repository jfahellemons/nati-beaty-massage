import { z } from "zod";
import { services } from "@/content/services";

const slugs = services.map((s) => s.slug) as [string, ...string[]];

export const reviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Vul uw naam in." })
    .max(60, { error: "Gebruik maximaal 60 tekens." }),
  service: z.enum(slugs, { error: "Kies de behandeling die u heeft gehad." }),
  rating: z.coerce
    .number({ error: "Geef een beoordeling van 1 tot 5 sterren." })
    .int()
    .min(1, { error: "Geef een beoordeling van 1 tot 5 sterren." })
    .max(5, { error: "Geef een beoordeling van 1 tot 5 sterren." }),
  text: z
    .string()
    .trim()
    .min(20, { error: "Schrijf minimaal 20 tekens." })
    .max(800, { error: "Gebruik maximaal 800 tekens." }),
  consent: z.literal("on", { error: "Geef toestemming om uw review te publiceren." }),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export type ReviewFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      /** Unique per attempt; remounts the fields so they show the submitted values again. */
      attempt: number;
      message?: string;
      fieldErrors?: Partial<Record<keyof ReviewInput, string>>;
      values?: Partial<Record<keyof ReviewInput, string>>;
    };

/** "Sanne de Vries" → "Sanne V." (first name + initial of the last word). */
export function displayName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}
