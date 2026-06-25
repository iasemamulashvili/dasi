import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/utils/auth';

export const dynamic = 'force-dynamic';

// Server-side telemetry to capture the last signature generation error for debugging
let lastSignatureError: string | null = null;

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
    (k) =>
      k.toLowerCase().includes('blob') ||
      k.toLowerCase().includes('write_token') ||
      k.toLowerCase().includes('kv') ||
      k.toLowerCase().includes('redis')
  );

  const hasUpstashRedis = !!(process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN);
  const hasVercelKv = !!(process.env.KV_URL || process.env.KV_REST_API_URL || process.env.KV_REST_API_TOKEN);
  const vercelKvEnabled = !!(
    (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || process.env.STORAGE_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_TOKEN || process.env.STORAGE_TOKEN)
  );

  return NextResponse.json({
    vercelBlobEnabled: !!token || !!process.env.BLOB_STORE_ID,
    hasDefaultBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    hasStoreId: !!process.env.BLOB_STORE_ID,
    detectedBlobKeys: blobOrTokenKeys,
    vercelEnv: process.env.VERCEL_ENV || null,
    nodeEnv: process.env.NODE_ENV || null,
    lastSignatureError,
    vercelKvEnabled,
    hasUpstashRedis,
    hasVercelKv,
  });
}

// POST handler: Handles both Vercel Blob client signatures and local file uploads
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Case A: Client-side direct upload signature request (JSON)
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as HandleUploadBody;

      // Only enforce admin session for token generation, NOT for Vercel's webhook callback!
      if (body.type === 'blob.generate-client-token') {
        const session = await getSession();
        if (!session) {
          lastSignatureError = 'Unauthorized: Admin session required';
          return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
        }
      }

      const token = getBlobToken();

      if (!token && !process.env.BLOB_STORE_ID) {
        lastSignatureError = 'Vercel Blob is not configured on the server. Please connect a Vercel Blob store in your Vercel dashboard and redeploy to enable video uploads.';
        return NextResponse.json({
          error: 'Vercel Blob is not configured. Please connect a Vercel Blob store in your Vercel dashboard and redeploy to enable video uploads.'
        }, { status: 500 });
      }

      try {
        const jsonResponse = await handleUpload({
          body,
          request,
          onBeforeGenerateToken: async (pathname, clientPayload) => {
            const config: any = {
              allowedContentTypes: ['video/mp4'],
            };
            if (token) {
              config.token = token;
            }
            return config;
          },
          onUploadCompleted: async ({ blob, tokenPayload }) => {
            // Log completion on the server
            console.log('Vercel Blob upload completed successfully:', blob.url);
          },
        });

        // Reset error on success
        lastSignatureError = null;
        return NextResponse.json(jsonResponse);
      } catch (error: any) {
        console.error('handleUpload signature generation error:', error);
        lastSignatureError = error.message || String(error);
        return NextResponse.json({ error: error.message || 'Signature generation failed' }, { status: 400 });
      }
    }

    // Case B: Local development / Fallback file write (multipart/form-data)
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    // Server-side Content-Length size check of 50MB
    const contentLengthHeader = request.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (!isNaN(contentLength) && contentLength > 50 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds the 50MB limit.' }, { status: 400 });
      }
    }

    // Disable local filesystem writes in production
    if (process.env.NODE_ENV === 'production') {
      const token = getBlobToken();
      if (!token && !process.env.BLOB_STORE_ID) {
        return NextResponse.json({
          error: 'Local filesystem uploads are disabled in production, and Vercel Blob is not configured. Please connect a Vercel Blob store in your Vercel dashboard and redeploy to enable video uploads.'
        }, { status: 400 });
      }
      return NextResponse.json({
        error: 'Local filesystem uploads are disabled in production. Please use Vercel Blob to upload videos.'
      }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Server-side file size check of 50MB
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds the 50MB limit.' }, { status: 400 });
    }

    // Security check: only allow MP4 videos to be written
    if (file.type !== 'video/mp4' && !file.name.toLowerCase().endsWith('.mp4')) {
      return NextResponse.json({ error: 'Only MP4 videos are allowed.' }, { status: 400 });
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
