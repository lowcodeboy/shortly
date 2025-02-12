import AuthGuard from '@/app/components/shared/AuthGuard';
import UrlShortener from '@/app/components/url/UrlShortener';
import UrlList from '@/app/components/url/UrlList';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-black text-white">
        <header className="p-6">
          <div className="flex items-center gap-2">
            
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>1M+ Links Shortened</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>100K+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>99.9% Uptime</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Shorten, share, and track<br />your links in one place
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transform long, unwieldy URLs into clean, memorable links. Get detailed analytics and take control of your link sharing experience.
            </p>
          </div>
          <UrlShortener />
          <UrlList />
        </main>
      </div>
    </AuthGuard>
  );
} 