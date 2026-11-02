import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Reusing the nodemailer config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function GET(request: Request) {
  try {
    // 1. Secure the Cron Route (Ensure only your cron service can trigger this)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch all "Shortlisted" candidates
    const fetchRes = await fetch(`${process.env.STRAPI_API_URL}/api/candidates?filters[candidateStatus][$eq]=Shortlisted`, {
      headers: { 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` },
      cache: 'no-store'
    });

    if (!fetchRes.ok) throw new Error('Failed to fetch candidates');
    const { data: candidates } = await fetchRes.json();

    let emailsSent = 0;

    // 3. Process each candidate
    for (const candidate of candidates) {
      const { email, firstName } = candidate.attributes;

      // Generate a one-time secure hash (UUID)
      const magicToken = crypto.randomUUID();

      // Update the candidate with the token in Strapi
      await fetch(`${process.env.STRAPI_API_URL}/api/candidates/${candidate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({ data: { magicToken } }),
      });

      // Construct the magic link (replace localhost with your production Next.js domain)
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const magicLink = `${baseUrl}/careers/update-status?token=${magicToken}`;

      // Send the email
      await transporter.sendMail({
        from: `"Solvetude Careers" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Are you still available? Update your Solvetude application`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #11192b;">
            <h2>Hi ${firstName},</h2>
            <p>You are currently on our shortlist for future openings at Solvetude!</p>
            <p>We are doing our quarterly check-in to see if you are still looking for new opportunities.</p>
            <p><strong>Please click the link below to update your status instantly:</strong></p>
            <a href="${magicLink}" style="display: inline-block; padding: 12px 24px; background-color: #11192b; color: #ffffff; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Update My Status</a>
            <p style="margin-top: 24px; font-size: 12px; color: #666;">This is a secure, one-time link. No password required.</p>
          </div>
        `,
      });

      emailsSent++;
    }

    return NextResponse.json({ success: true, candidatesProcessed: emailsSent });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}