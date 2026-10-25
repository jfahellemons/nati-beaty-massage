import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabase } from "@/lib/supabase";

export const REVIEWS_TAG = "reviews";

export type PublicReview = {
  id: string;
  name: string;
  serviceSlug: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type ReviewRow = {
  id: string;
  created_at: string;
  name: string;
  service_slug: string;
  rating: number;
  text: string;
  status: "pending" | "approved" | "rejected";
};

/** Approved reviews, newest first. Cached until a review is moderated. */
export async function getApprovedReviews(limit = 6): Promise<PublicReview[]> {
  "use cache";
  cacheTag(REVIEWS_TAG);
  cacheLife("days");

  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, created_at, name, service_slug, rating, text")
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load reviews", error);
    return [];
  }
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    serviceSlug: r.service_slug,
    rating: r.rating,
    text: r.text,
    createdAt: r.created_at,
  }));
}

export async function getReviewById(id: string): Promise<ReviewRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from("reviews")
    .select("id, created_at, name, service_slug, rating, text, status")
    .eq("id", id)
    .maybeSingle();
  return data;
}
