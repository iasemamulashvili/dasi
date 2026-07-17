import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSettings } from '@/utils/db';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const subject = data.get('subject') as string;
    const message = data.get('message') as string;
    // Collect all attachments from form data
    const attachments = [];
    const legacyFile = data.get('file') as File | null;
    if (legacyFile) {
      const arrayBuffer = await legacyFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      attachments.push({
        filename: legacyFile.name,
        content: buffer,
      });
    }

    // Dynamic multi-uploads
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
    // Collect all URL inputs from form data
    const urls: { label: string; value: string }[] = [];
    for (const [key, value] of data.entries()) {
      if (key.startsWith('url_') && typeof value === 'string' && value.trim()) {
        const typeKey = key.replace('url_', '');
        const urlLabel = uploadLabels[typeKey] || typeKey.toUpperCase();
        urls.push({ label: urlLabel, value });
      }
    }

    console.log('Contact form submission received:', {
      name,
      email,
      subject,
      message,
      attachmentsCount: attachments.length,
      attachedFiles: attachments.map(a => a.filename).join(', '),
      urlsSubmitted: urls.map(u => `${u.label}: ${u.value}`).join(', ') || 'none'
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const settings = await getSettings();
    const destEmail = settings.contactEmail;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Send the email
      await resend.emails.send({
        from: 'Dasi Games Website <noreply@dasigames.com>',
        to: destEmail,
        replyTo: email,
        subject: `Website Contact: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #333;">
            <h2 style="color: #2952a3; border-bottom: 1px solid #ddd; padding-bottom: 8px;">New Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            ${urls.length > 0 ? `
            <p><strong>Custom Links:</strong></p>
            <ul style="background-color: #f7f9fc; padding: 15px; border-radius: 8px; border: 1px solid #e1e8ed; list-style-type: none; margin: 0 0 15px 0; padding-left: 15px;">
              ${urls.map(u => `<li><strong>${u.label}:</strong> <a href="${u.value}" target="_blank">${u.value}</a></li>`).join('')}
            </ul>
            ` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line; background-color: #f7f9fc; padding: 15px; border-radius: 8px; border: 1px solid #e1e8ed;">${message}</p>
          </div>
        `,
        attachments,
      });

      console.log('Email sent successfully via Resend');
    } else {
      console.warn('RESEND_API_KEY is not defined. Email was NOT sent (Local Simulation Mode).');
      // Simulate network delay locally
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    return NextResponse.json({ success: true, message: 'Message processed successfully' });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
