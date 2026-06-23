import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'ZKR Store <noreply@zkrstore.com>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify your ZKR Store account',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Welcome to ZKR Store!</h1>
        <p>Click the button below to verify your email address:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #64748b; font-size: 14px;">This link expires in 24 hours.</p>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't create an account, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset your ZKR Store password',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Password Reset Request</h1>
        <p>Click the button below to reset your password:</p>
        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(email: string, orderNumber: string, total: number) {
  return sendEmail({
    to: email,
    subject: `Order ${orderNumber} confirmed`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0f172a;">Order Confirmed! 🎉</h1>
        <p>Thank you for your order. Your order number is <strong>${orderNumber}</strong>.</p>
        <p>Total: <strong>$${total.toFixed(2)}</strong></p>
        <p>We'll send you tracking information once your order ships.</p>
      </div>
    `,
  });
}