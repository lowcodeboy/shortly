'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserUrls, type UrlMapping, deleteUrl } from '@/app/lib/firebase/urls';

export default function UrlList() {
  const [urls, setUrls] = useState<UrlMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadUrls = async () => {
    if (user) {
      const userUrls = await getUserUrls(user.uid);
      setUrls(userUrls);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUrls();
  }, [user]);

  // Add this effect to refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadUrls();
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  const handleDelete = async (shortId: string) => {
    try {
      const success = await deleteUrl(shortId);
      if (success) {
        // Remove the URL from the local state
        setUrls(urls.filter(url => url.shortId !== shortId));
      }
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-400 mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12">
      {urls.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">Your Shortened URLs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...urls]
              .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
              .map((url) => (
              <div
                key={url.shortId}
                className="bg-[#111827] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors flex flex-col"
              >
                <p className="text-blue-400 font-medium text-lg mb-2 break-all">
                  {`${window.location.origin}/${url.shortId}`}
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="truncate">{url.longUrl}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-gray-500 text-xs">
                    {url.createdAt?.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${url.shortId}`)}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(url.shortId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete URL"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 