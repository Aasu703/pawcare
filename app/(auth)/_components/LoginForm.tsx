'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../schema';
import Link from 'next/link';
import { handleLogin } from '@/lib/actions/auth-actions';
import { useAuth } from '@/context/AuthContext'; 

export default function LoginForm() {
  const {checkAuth, isAuthenticated, user} = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/user/home';
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });

      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        setErrors({
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        setLoading(false);
        return;
      }

      // Call login action (sets auth cookies server-side)
      const response = await handleLogin(result.data);
      console.log('🔐 Login response:', response);
      
      if (response.success) {
        console.log('✅ Login successful, user role:', response.data?.role);
        
        // Update auth context with user data
        await checkAuth(response.data);
        
        // Hard redirect — ensures cookies are sent to server and middleware handles routing
        const redirectPath = response.data.role === 'admin' ? '/admin' : '/user/home';
        window.location.href = redirectPath;
        return; // Stop further execution
      } else {
        console.error('❌ Login failed:', response.message);
        const errorMessage = response.message === "Error" ? "Login failed. Please check your credentials." : response.message || 'Login failed';
        setErrors({ email: errorMessage });
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message === "Error" ? "Login failed. Please check your credentials." : error.message || 'Login failed';
      setErrors({ email: errorMessage });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f4f57] to-[#0c4148]">
      <div className="w-full max-w-md bg-[#0c4148] border border-[#f8d548]/40 p-8 rounded-2xl shadow-xl shadow-yellow-500/20">
        <h1 className="text-2xl font-bold text-white mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#f8d548]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#f8d548]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f8d548] hover:brightness-95 disabled:bg-yellow-300 text-[#0c4148] font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link href="/forget-password" className="text-[#f8d548] hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-200">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#f8d548] hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
