import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { REVIEWS_TAG } from "@/lib/reviews/queries";

const ALLOWED_TAGS = new Set([REVIEWS_TAG]);

/** Called by the management app after a review is published or removed. */
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET ?? "";
  const given = Buffer.from(request.headers.get("x-revalidate-secret") ?? "");
  const ok =
    expected.length >= 32 &&
    given.length === expected.length &&
    timingSafeEqual(given, Buffer.from(expected));
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { tag } = (await request.json().catch(() => ({}))) as { tag?: string };
  if (!tag || !ALLOWED_TAGS.has(tag)) return NextResponse.json({ error: "unknown tag" }, { status: 400 });

  // Expire immediately: the next visitor sees the change.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tag });
}
