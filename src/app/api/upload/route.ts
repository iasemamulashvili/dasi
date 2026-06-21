import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/utils/auth';

// Helper to get the token (checks for default or custom names)
function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || 
         Object.keys(process.env)
           .filter((k) => k.endsWith('_READ_WRITE_TOKEN'))
           .map((k) => process.env[k])[0];
}

// GET handler: Diagnostics and status check for the client
export async function GET() {
  const token = getBlobToken();
  const envKeys = Object.keys(process.env);
  const blobOrTokenKeys = envKeys.filter(
    (k) => k.toLowerCase().includes('blob') || k.toLowerCase().includes('write_token')
  );

  return NextResponse.json({
    vercelBlobEnabled: !!token,
    hasDefaultBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    detectedBlobKeys: blobOrTokenKeys,
    vercelEnv: process.env.VERCEL_ENV || null,
    nodeEnv: process.env.NODE_ENV || null,
  });
}

// POST handler: Handles both Vercel Blob client signatures and local file uploads
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Case A: Client-side direct upload signature request (JSON)
    if (contentType.includes('application/json')) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
      }

      const body = (await request.json()) as HandleUploadBody;
      const token = getBlobToken();

      if (!token) {
        return NextResponse.json({ error: 'Vercel Blob token is not configured on the server.' }, { status: 500 });
      }

      try {
        const jsonResponse = await handleUpload({
          body,
          request,
          onBeforeGenerateToken: async (pathname, clientPayload) => {
            return {
              allowedContentTypes: ['video/mp4'],
              token,
            };
          },
          onUploadCompleted: async ({ blob, tokenPayload }) => {
            // Log completion on the server
            console.log('Vercel Blob upload completed successfully:', blob.url);
          },
        });

        return NextResponse.json(jsonResponse);
      } catch (error: any) {
        console.error('handleUpload signature generation error:', error);
        return NextResponse.json({ error: error.message || 'Signature generation failed' }, { status: 400 });
      }
    }

    // Case B: Local development / Fallback file write (multipart/form-data)
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Verify if we can write files locally
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
        error: 'Vercel Blob token (BLOB_READ_WRITE_TOKEN) is not loaded in production. Please connect Blob Storage in Vercel and click Redeploy.' 
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
