import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "tcc_admin_session";

function getExpectedToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return null;
  return crypto.createHmac("sha256", secret).update("tcc-admin").digest("hex");
}

export function verifyAdminPassword(password: string) {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  return password === secret;
}

export function getAdminSessionToken() {
  return getExpectedToken();
}

export function isValidAdminSession(token: string | undefined) {
  const expected = getExpectedToken();
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
