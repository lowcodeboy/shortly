import { getLongUrl } from '@/app/lib/firebase/urls';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  const shortId = params.shortId;

  try {
    const longUrl = await getLongUrl(shortId);

    if (!longUrl) {
      return new NextResponse('URL not found', { status: 404 });
    }

    // Redirect to the long URL
    return NextResponse.redirect(longUrl);
  } catch (error) {
    console.error('Error during redirect:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 