import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildContactEmailHtml } from '@/lib/auth/email-templates';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const adminEmail = process.env.SMTP_USER;

    await transporter.sendMail({
      to: adminEmail,
      from: `"${name}" <${adminEmail}>`,
      replyTo: `"${name}" <${email}>`,
      subject: `New Contact Form Submission from ${name}: ${subject}`,
      html: buildContactEmailHtml(name, email, subject, message),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact-api]', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
