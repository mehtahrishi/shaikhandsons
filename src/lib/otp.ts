/**
 * Stateless OTP signing using Node.js built-in crypto (HMAC-SHA256).
 * No external JWT library needed. Works in Next.js API routes (Node runtime).
 *
 * Flow:
 *  1. signOtpToken(email, otp) → signed token string
 *  2. Token returned to client, stored in sessionStorage
 *  3. verifyOtpToken(token, enteredOtp) → { valid, email }
 */

import crypto from 'crypto';

interface OtpPayload {
  email: string;
  otp: string;
  exp: number; // Unix ms
}

function getSecret(): string {
  const secret = process.env.OTP_JWT_SECRET;
  if (!secret) throw new Error('OTP_JWT_SECRET is not set in environment variables.');
  return secret;
}

/** Sign a payload into a compact token: base64url(header).base64url(payload).signature */
export function signOtpToken(email: string, otp: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'OTP' })).toString('base64url');
  const payload: OtpPayload = {
    email,
    otp,
    exp: Date.now() + 10 * 60 * 1000, // 10 minutes
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSecret())
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${sig}`;
}

/** Verify signature, expiry, and OTP match. Returns { valid, email }. */
export function verifyOtpToken(
  token: string,
  enteredOtp: string
): { valid: boolean; email?: string; reason?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false, reason: 'malformed_token' };

    const [header, body, sig] = parts;

    // 1. Verify HMAC signature
    const expected = crypto
      .createHmac('sha256', getSecret())
      .update(`${header}.${body}`)
      .digest('base64url');
    if (expected !== sig) return { valid: false, reason: 'invalid_signature' };

    // 2. Decode payload
    const payload: OtpPayload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));

    // 3. Check expiry
    if (Date.now() > payload.exp) return { valid: false, reason: 'expired' };

    // 4. Check OTP
    if (payload.otp !== enteredOtp.trim()) return { valid: false, reason: 'wrong_otp' };

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false, reason: 'parse_error' };
  }
}

/** Generate a cryptographically secure 6-digit OTP. */
export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}
