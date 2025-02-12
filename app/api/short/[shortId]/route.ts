import { getLongUrl } from '@/app/lib/firebase/urls';
import { NextRequest } from 'next/server';

interface RouteSegment {
  params: Promise<{
    shortId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  segment: RouteSegment
) {
  const { shortId } = await segment.params;

  try {
    const longUrl = await getLongUrl(shortId);

    if (!longUrl) {
      return Response.json({ error: 'URL not found' }, { status: 404 });
    }

    return Response.redirect(longUrl);
  } catch (error) {
    console.error('Error during redirect:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 