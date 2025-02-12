import RegisterForm from '@/app/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg 
            className="w-8 h-8 text-white" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
            />
          </svg>
          <span className="text-2xl font-bold">short.ly</span>
        </div>
        <h1 className="text-4xl font-bold mb-8 text-center">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">
          Join thousands of users shortening their links
        </p>
        <RegisterForm />
      </div>
    </div>
  );
} 