import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtp, signOtpToken } from '@/lib/otp';
import { createOTPToken } from '@/lib/db/auth';

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

    // 2. Store OTP in PostgreSQL
    try {
      await createOTPToken(email.toLowerCase().trim());
    } catch (dbError) {
      console.error('[send-otp] DB error:', dbError);
      // Don't fail if DB storage fails, we still have the stateless token
    }

    // 3. Send OTP email via Gmail SMTP
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

    // 4. Return signed token to client (otp is NEVER returned — only in token)
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
      background:#f8f8f8;
      border:1px solid #CE1212;
      border-radius:4px;
      font-size:28px;
      font-weight:900;
      color:#000;
      margin:0 4px;
      font-family:'Courier New', Courier, monospace;
    ">${d}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shaikh &amp; Sons — Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Poppins', 'Helvetica Neue', Arial, sans-serif;color:#000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="padding:40px 40px;text-align:center;">
            <div style="font-size:24px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:#000;font-family:'Playfair Display', serif;white-space:nowrap;">
              SHAIKH <span style="color:#CE1212;">&amp;</span> SONS
            </div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px;text-align:center;">
            <h2 style="color:#000;font-size:22px;font-weight:700;letter-spacing:1px;margin:0 0 12px;font-family:'Playfair Display', serif;">
              Identity Verification
            </h2>
            <p style="color:#333;font-size:14px;line-height:1.6;margin:0 0 40px;font-weight:400;">
              A code has been requested to login.
            </p>

            <!-- OTP Boxes -->
            <div style="margin:0 auto 40px;">
              ${digits}
            </div>

            <p style="color:#666;font-size:12px;line-height:1.8;margin:0;max-width:320px;margin-left:auto;margin-right:auto;">
              Code expires in 10 minutes. If you did not initiate this request, please ignore this email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:32px 40px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="color:#999;font-size:10px;margin:0;line-height:1.6;letter-spacing:1px;text-transform:uppercase;font-weight:700;">
              © ${new Date().getFullYear()} Shaikh and Sons Private Limited.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

