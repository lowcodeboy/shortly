'use client';

import { useState } from 'react';
import { signUp } from '@/app/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { user, error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
      return;
    }

    if (user) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-300">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 text-white"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Account
      </button>

      <p className="mt-4 text-sm text-center text-gray-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
} 