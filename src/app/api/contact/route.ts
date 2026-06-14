import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');
    const file = data.get('file') as File | null;

    // Log the submission (in a production setting you might save to DB or email via Resend/Nodemailer)
    console.log('Contact form submission received:', {
      name,
      email,
      subject,
      message,
      fileAttached: file ? file.name : 'none',
      fileSize: file ? `${(file.size / 1024).toFixed(1)} KB` : '0 KB',
    });

    // Simple delay to simulate server processes
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ success: true, message: 'Message logged successfully' });
  } catch (error: any) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}
