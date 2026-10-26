"use server";

import { getSupabase } from "@/lib/supabase";
import { clientIp, rateLimited, verifyTurnstile } from "@/lib/security";
import { reviewSchema, displayName, type ReviewFormState, type ReviewInput } from "./schema";

const GENERIC_ERROR =
  "Er ging iets mis bij het versturen. Probeer het later opnieuw of stuur Nataly een WhatsApp-bericht.";

/**
 * Stores a review as `pending`. A database trigger queues the moderation email,
 * which the management app (nataly-beheer) sends to Nataly.
 */
export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  // Honeypot: bots fill every field. Pretend success.
  if (formData.get("website")) return { status: "success" };

  const raw = {
    name: String(formData.get("name") ?? ""),
    service: String(formData.get("service") ?? ""),
    rating: String(formData.get("rating") ?? ""),
    text: String(formData.get("text") ?? ""),
    consent: formData.get("consent") ?? undefined,
  };
  const values = {
    name: raw.name,
    service: raw.service,
    rating: raw.rating,
    text: raw.text,
    consent: raw.consent ? "on" : "",
  };
  const fail = (message: string): ReviewFormState => ({
    status: "error",
    attempt: Date.now(),
    message,
    values,
  });

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ReviewInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ReviewInput;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", attempt: Date.now(), fieldErrors, values };
  }

  const ip = await clientIp();
  if (rateLimited(`review:${ip}`, 5, 10 * 60_000)) {
    return fail("U heeft al een paar reviews verstuurd. Probeer het later opnieuw.");
  }
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
    return fail("De beveiligingscontrole is mislukt. Probeer het opnieuw.");
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("submitReview: Supabase is not configured");
    return fail(GENERIC_ERROR);
  }

  const review = parsed.data;
  const { error } = await supabase.from("reviews").insert({
    name: displayName(review.name),
    service_slug: review.service,
    rating: review.rating,
    text: review.text,
    consent_publish: true,
    status: "pending",
  });
  if (error) {
    console.error("submitReview: insert failed", error);
    return fail(GENERIC_ERROR);
  }
  return { status: "success" };
}
