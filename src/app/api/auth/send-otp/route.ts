import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtp, signOtpToken } from '@/lib/auth/otp';
import { buildOtpEmailHtml } from '@/lib/auth/email-templates';

export const runtime = 'nodejs'; // Ensure Node.js runtime for crypto + nodemailer

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    // 1. Generate OTP and sign it into a stateless token (no DB storage needed)
    const otp = generateOtp();
    const token = signOtpToken(email.toLowerCase().trim(), otp);

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
      html: buildOtpEmailHtml(otp, 'Verification'),
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
