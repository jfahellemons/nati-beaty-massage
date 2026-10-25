"use server";

import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { Resend } from "resend";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { getSupabase } from "@/lib/supabase";
import { ReviewModerationEmail } from "@/emails/ReviewModeration";
import { reviewSchema, displayName, type ReviewFormState, type ReviewInput } from "./schema";
import { createModerationToken, verifyModerationToken } from "./tokens";
import { REVIEWS_TAG } from "./queries";

const GENERIC_ERROR =
  "Er ging iets mis bij het versturen. Probeer het later opnieuw of stuur Nataly een WhatsApp-bericht.";

// Best-effort limit per server instance; Turnstile is the main spam barrier.
const recent = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

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

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ReviewInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ReviewInput;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", attempt: Date.now(), fieldErrors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      attempt: Date.now(),
      message: "U heeft al een paar reviews verstuurd. Probeer het later opnieuw.",
      values,
    };
  }
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) {
    return {
      status: "error",
      attempt: Date.now(),
      message: "De beveiligingscontrole is mislukt. Probeer het opnieuw.",
      values,
    };
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("submitReview: Supabase is not configured");
    return { status: "error", attempt: Date.now(), message: GENERIC_ERROR, values };
  }

  const review = parsed.data;
  const name = displayName(review.name);
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name,
      service_slug: review.service,
      rating: review.rating,
      text: review.text,
      consent_publish: true,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("submitReview: insert failed", error);
    return { status: "error", attempt: Date.now(), message: GENERIC_ERROR, values };
  }

  try {
    await sendModerationEmail({ ...review, id: data.id, name });
  } catch (err) {
    // The review is saved; Nataly can still moderate it in Supabase.
    console.error("submitReview: moderation email failed", err);
  }

  return { status: "success" };
}

async function sendModerationEmail(review: { id: string; name: string } & ReviewInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const link = (action: "approve" | "reject") =>
    `${site.url}/review/beheer?token=${createModerationToken(review.id, action)}`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? `${site.name} <onboarding@resend.dev>`,
    to: process.env.REVIEW_NOTIFY_EMAIL ?? site.email,
    subject: `Nieuwe review van ${review.name} (${review.rating}/5)`,
    react: ReviewModerationEmail({
      name: review.name,
      service: getService(review.service)?.title ?? review.service,
      rating: review.rating,
      text: review.text,
      approveUrl: link("approve"),
      rejectUrl: link("reject"),
    }),
  });
  if (error) throw new Error(error.message);
}

export type ModerationState = { status: "idle" | "done" | "error"; message?: string };

/** Confirm step of a moderation link. Only reachable with a valid signed token. */
export async function moderateReview(_prev: ModerationState, formData: FormData): Promise<ModerationState> {
  const verified = verifyModerationToken(String(formData.get("token") ?? ""));
  if (!verified) return { status: "error", message: "Deze link is ongeldig of verlopen." };

  const supabase = getSupabase();
  if (!supabase) return { status: "error", message: "De database is niet geconfigureerd." };

  const approved = verified.action === "approve";
  const { error } = await supabase
    .from("reviews")
    .update({
      status: approved ? "approved" : "rejected",
      approved_at: approved ? new Date().toISOString() : null,
    })
    .eq("id", verified.reviewId);

  if (error) {
    console.error("moderateReview failed", error);
    return { status: "error", message: "Opslaan is mislukt. Probeer het opnieuw." };
  }

  updateTag(REVIEWS_TAG);
  return {
    status: "done",
    message: approved
      ? "De review staat nu op de website."
      : "De review is verwijderd en wordt niet getoond.",
  };
}
