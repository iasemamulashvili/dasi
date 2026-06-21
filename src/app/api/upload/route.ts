import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 1. Try Vercel Blob first (active in production once connected on Vercel)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      try {
        const blobResult = await put(filename, file, {
          access: 'public',
          token: blobToken,
        });
        return NextResponse.json({ url: blobResult.url });
      } catch (e: any) {
        console.error('Vercel Blob upload failed, trying local fallback:', e);
      }
    }

    // 2. Local fallback (saves to public/videos/ locally during dev)
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const dirPath = path.join(process.cwd(), 'public', 'videos');
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const filePath = path.join(dirPath, filename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({ url: `/videos/${filename}` });
    } catch (e: any) {
      console.error('Local file write failed:', e);
      return NextResponse.json({ error: 'Failed to save file locally' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload processing failed' }, { status: 500 });
  }
}
