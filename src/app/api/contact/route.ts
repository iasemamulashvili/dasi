import { NextResponse } from 'next/server';
import React from 'react';
import { Resend } from 'resend';
import { getSettings } from '@/utils/db';
import { checkRateLimit } from '@/utils/rateLimit';
import ContactFormEmail from '@/components/emails/ContactFormEmail';
import { render } from '@react-email/components';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateLimit = checkRateLimit(clientIp, 5, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.reset),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
          }
        }
      );
    }

    const data = await request.formData();
    const name = (data.get('name') as string) || 'Anonymous';
    const email = (data.get('email') as string) || '';
    const subject = (data.get('subject') as string) || 'General Inquiry';
    const message = (data.get('message') as string) || '';

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and Message are required fields.' }, { status: 400 });
    }

    const attachments = [];
    const legacyFile = data.get('file') as File | null;
    if (legacyFile && legacyFile.size > 0) {
      const arrayBuffer = await legacyFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: legacyFile.name,
        content: buffer,
      });
    }

    const uploadLabels: { [key: string]: string } = {
      cv: 'CV',
      portfolio: 'Portfolio',
      art3d: '3D_Art',
      pitchdeck: 'Pitch_Deck'
    };

    for (const [key, value] of data.entries()) {
      if (key.startsWith('file_') && value instanceof File && value.size > 0) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const typeKey = key.replace('file_', '');
        const fileLabel = uploadLabels[typeKey] || typeKey.toUpperCase();
        attachments.push({
          filename: `${fileLabel}_${value.name}`,
          content: buffer,
        });
      }
    }

    const customFields: Record<string, string> = {};
    for (const [key, value] of data.entries()) {
      if (key.startsWith('url_') && typeof value === 'string' && value.trim()) {
        const typeKey = key.replace('url_', '');
        const urlLabel = uploadLabels[typeKey] || typeKey.toUpperCase();
        customFields[`Link: ${urlLabel}`] = value;
      }
    }

    console.log(`[POST /api/contact] Received inquiry from IP ${clientIp}:`, {
      name,
      email,
      subject,
      attachmentsCount: attachments.length,
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const settings = await getSettings();
    const destEmail = settings.contactEmail || 'contact@dasigames.com';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailHtml = await render(
        React.createElement(ContactFormEmail, {
          name,
          email,
          subject,
          message,
          resumeFileName: attachments[0]?.filename,
          customFields,
        })
      );

      await resend.emails.send({
        from: 'Dasi Games Website <noreply@dasigames.com>',
        to: destEmail,
        replyTo: email,
        subject: `[Website Inquiry] ${subject} - ${name}`,
        html: emailHtml,
        attachments,
      });

      console.log('Email sent successfully via Resend');
    } else {
      console.warn('RESEND_API_KEY is not set. Inquiry recorded in simulation mode.');
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
