import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtp, signOtpToken } from '@/lib/otp';

export const runtime = 'nodejs'; // Ensure Node.js runtime for crypto + nodemailer

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    // 1. Generate OTP and sign it into a stateless token
    const otp = generateOtp();
    const token = signOtpToken(email.toLowerCase().trim(), otp);

    // 2. Send OTP email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false, // STARTTLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shaikh & Sons" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔐 Your Verification Code — Shaikh & Sons',
      html: buildEmailHtml(otp),
    });

    // 3. Return signed token to client (otp is NEVER returned — only in token)
    return NextResponse.json({ token });
  } catch (err) {
    console.error('[send-otp]', err);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── Premium HTML Email ───────────────────────────────────────────────────────

function buildEmailHtml(otp: string): string {
  const digits = otp.split('').map(
    (d) => `<span style="
      display:inline-block;
      width:44px;height:56px;
      line-height:56px;
      text-align:center;
      background:#1a1a1a;
      border:1px solid #c9a84c;
      border-radius:6px;
      font-size:28px;
      font-weight:900;
      color:#c9a84c;
      margin:0 4px;
      font-family:monospace;
    ">${d}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shaikh &amp; Sons — Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:12px;overflow:hidden;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#161616,#0d0d0d);padding:36px 40px;text-align:center;border-bottom:1px solid #222;">
            <div style="font-size:22px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:#c9a84c;">
              SHAIKH &amp; SONS
            </div>
            <div style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-top:6px;">
              High-Performance Electronic Mobility
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px 40px;text-align:center;">
            <div style="width:52px;height:52px;background:#1a1a1a;border:1px solid #c9a84c;border-radius:50%;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
              <span style="font-size:24px;">🔐</span>
            </div>
            <h2 style="color:#fff;font-size:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">
              Security Verification
            </h2>
            <p style="color:#888;font-size:14px;line-height:1.6;margin:0 0 36px;">
              Use the code below to complete your sign-in.<br/>
              It expires in <strong style="color:#c9a84c;">10 minutes</strong>.
            </p>

            <!-- OTP Boxes -->
            <div style="margin:0 auto 36px;">
              ${digits}
            </div>

            <p style="color:#555;font-size:12px;line-height:1.7;margin:0;">
              If you did not request this code, you can safely ignore this email.<br/>
              Never share this code with anyone.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d0d0d;padding:24px 40px;text-align:center;border-top:1px solid #1a1a1a;">
            <p style="color:#3a3a3a;font-size:11px;margin:0;line-height:1.6;">
              © ${new Date().getFullYear()} Shaikh &amp; Sons. All rights reserved.<br/>
              This is an automated security notification — please do not reply.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
