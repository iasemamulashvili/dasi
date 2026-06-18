import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const subject = data.get('subject') as string;
    const message = data.get('message') as string;
    const file = data.get('file') as File | null;

    console.log('Contact form submission received:', {
      name,
      email,
      subject,
      message,
      fileAttached: file ? file.name : 'none',
      fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : '0 KB',
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    const destEmail = process.env.CONTACT_DESTINATION_EMAIL || 'info@dasigames.com';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const attachments = [];

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }

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
