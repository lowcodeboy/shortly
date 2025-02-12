'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getUserUrls, type UrlMapping } from '@/app/lib/firebase/urls';

export default function UrlList() {
  const [urls, setUrls] = useState<UrlMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadUrls = async () => {
      if (user) {
        const userUrls = await getUserUrls(user.uid);
        setUrls(userUrls);
        setIsLoading(false);
      }
    };

    loadUrls();
  }, [user]);

  if (isLoading) {
    return <div className="text-center text-gray-400 mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {urls.length > 0 && (
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url.shortId}
              className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-blue-400 font-medium">
                    {`${window.location.origin}/${url.shortId}`}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {url.longUrl}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${url.shortId}`)}
                  className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                <span>{url.createdAt?.toLocaleDateString()}</span>
                <span>•</span>
                <span>{url.clicks} clicks</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 