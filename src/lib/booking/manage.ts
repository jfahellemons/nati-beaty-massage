import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token in the client's booking link (/afspraak/[id]?token=…). Same HMAC as
 * nataly-beheer's manageToken(), which puts the link in the emails.
 */
export function manageToken(bookingId: string) {
  const secret = process.env.MANAGE_LINK_SECRET;
  if (!secret || secret.length < 32) throw new Error("MANAGE_LINK_SECRET must be set (min. 32 characters)");
  return createHmac("sha256", secret).update(`manage:${bookingId}`).digest("base64url");
}

export function verifyManageToken(bookingId: string, token: string) {
  try {
    const a = Buffer.from(manageToken(bookingId));
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch (err) {
    console.error("verifyManageToken:", err);
    return false;
  }
}
