'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendEmail(data: ContactFormData): Promise<SendEmailResult> {
  const { name, email, message } = data;

  // Basic server-side validation
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { success: false, error: 'All fields are required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Invalid email address.' };
  }
  if (message.trim().length < 20) {
    return { success: false, error: 'Message must be at least 20 characters.' };
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ['bouhamousaad@gmail.com'],
      replyTo: email,
      subject: `[Portfolio Brief] from ${name}`,
      html: `
        <div style="font-family: monospace; background:#0a0a0a; color:#00FF41; padding:32px; border-radius:8px; border:1px solid #00FF41;">
          <h2 style="color:#00FF41; margin-bottom:16px;">NEW TRANSMISSION RECEIVED</h2>
          <p><strong>FROM:</strong> ${name}</p>
          <p><strong>EMAIL:</strong> ${email}</p>
          <hr style="border-color:#00FF41;opacity:0.2;margin:16px 0;" />
          <p><strong>MESSAGE:</strong></p>
          <p style="white-space:pre-wrap; color:#d4fae4;">${message}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error('[sendEmail] Resend error:', err);
    return { success: false, error: 'Failed to send message. Please try again later.' };
  }
}
