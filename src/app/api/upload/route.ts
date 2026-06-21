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
        console.error('Vercel Blob upload failed:', e);
        return NextResponse.json({ error: `Vercel Blob upload failed: ${e.message || e}` }, { status: 500 });
      }
    }

    // Check if we can write files locally (development mode fallback)
    const isWritable = (() => {
      try {
        const temp = path.join(process.cwd(), 'public', '.writable-test');
        const dir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(temp, 'test');
        fs.unlinkSync(temp);
        return true;
      } catch (e) {
        return false;
      }
    })();

    if (!isWritable) {
      return NextResponse.json({ 
        error: 'Vercel Blob token (BLOB_READ_WRITE_TOKEN) is not loaded in production. Please make sure you have connected Blob Storage to your project and clicked "Redeploy" on Vercel.' 
      }, { status: 500 });
    }
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
