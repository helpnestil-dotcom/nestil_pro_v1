// This API route is no longer used for Cloudinary uploads
// as the application has been switched to unsigned uploads using a preset.
// This file can be safely deleted.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated and no longer in use.' },
    { status: 410 }
  );
}
