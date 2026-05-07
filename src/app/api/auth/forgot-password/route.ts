import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateOtp, signOtpToken } from '@/lib/otp';
import { getUserByEmail } from '@/lib/db/auth';
import { buildOtpEmailHtml } from '@/lib/email-templates';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    const otp = generateOtp();
    const token = signOtpToken(email.toLowerCase().trim(), otp);

    // Database storage not needed - stateless token contains everything

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Shaikh & Sons" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔑 Password Reset Code — Shaikh & Sons',
      html: buildOtpEmailHtml(otp, 'PasswordReset'),
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error('[forgot-password]', err);
    return NextResponse.json(
      { error: 'Failed to send password reset code. Please try again.' },
      { status: 500 }
    );
  }
}
