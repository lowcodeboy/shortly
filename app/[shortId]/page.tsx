import { getLongUrl } from '@/app/lib/firebase/urls';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    shortId: string;
  }>;
}

export default async function ShortUrlRedirectPage({
  params,
}: PageProps) {
  // Await params before accessing shortId
  const { shortId } = await params;
  const longUrl = await getLongUrl(shortId);

  if (!longUrl) {
    // You could redirect to a 404 page or show an error
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">URL Not Found</h1>
          <p className="text-gray-600">The requested short URL does not exist.</p>
        </div>
      </div>
    );
  }

  redirect(longUrl);
} 