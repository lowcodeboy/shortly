'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createShortUrl } from '@/app/lib/firebase/urls';
import { isValidUrl, normalizeUrl } from '@/app/lib/utils/urlUtils';

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    // Validate URL
    const normalizedUrl = normalizeUrl(longUrl);
    if (!isValidUrl(normalizedUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createShortUrl(normalizedUrl, user?.uid || '');
      if (result) {
        const baseUrl = window.location.origin;
        setShortUrl(`${baseUrl}/${result.shortId}`);
        setLongUrl('');
      } else {
        setError('Failed to create short URL');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      // You could add a toast notification here
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          id="longUrl"
          type="text"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Paste your long URL here..."
          className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
          {!isLoading && (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}

      {shortUrl && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Shortened URLs</h3>
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-blue-400 font-medium">{shortUrl}</p>
                <p className="text-sm text-gray-400 mt-1">{longUrl}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 