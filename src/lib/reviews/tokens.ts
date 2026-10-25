import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export type ModerationAction = "approve" | "reject";

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.REVIEW_TOKEN_SECRET;
  if (!s || s.length < 32) throw new Error("REVIEW_TOKEN_SECRET must be set (min. 32 characters)");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Signed, expiring token for a one-tap moderation link. */
export function createModerationToken(reviewId: string, action: ModerationAction) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${reviewId}.${action}.${exp}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

export function verifyModerationToken(token: string): { reviewId: string; action: ModerationAction } | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const payload = Buffer.from(encoded, "base64url").toString();
  let expected: Buffer;
  try {
    expected = Buffer.from(sign(payload));
  } catch (err) {
    console.error("verifyModerationToken:", err);
    return null;
  }
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;

  const [reviewId, action, exp] = payload.split(".");
  if (action !== "approve" && action !== "reject") return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return { reviewId, action };
}
