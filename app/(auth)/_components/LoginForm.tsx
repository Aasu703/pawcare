'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../schema';
import Link from 'next/link';
import { handleLogin, handleProviderLogin } from '@/lib/actions/auth-actions';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { PawPrint, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginForm() {
  const { checkAuth, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider/dashboard' : '/user/home';
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

      // Call the appropriate login action based on selected role
      const response = role === 'provider'
        ? await handleProviderLogin(result.data)
        : await handleLogin(result.data);
      console.log('🔐 Login response:', response);

      if (response.success) {
        const userData = response.data?.user ?? response.data ?? null;
        console.log('✅ Login successful, user role:', userData?.role);

        if (!userData) {
          setErrors({ email: 'Login succeeded but user data missing' });
          setLoading(false);
          return;
        }

        // Update auth context with user data
        await checkAuth(userData);

        // Hard redirect — ensures cookies are sent to server and middleware handles routing
        const redirectPath = userData.role === 'admin' ? '/admin' : userData.role === 'provider' ? '/provider/dashboard' : '/user/home';
        window.location.href = redirectPath;
        return; // Stop further execution
      } else {
        console.error('❌ Login failed:', response.message);
        const errorMessage = response.message === "Error" ? "Login failed. Please check your credentials." : response.message || 'Login failed';
        setErrors({ email: errorMessage });
      }
      setLoading(false);
    } catch (data: any) {
      console.error('Login error:', error);
      const errorMessage = error.message === "Error" ? "Login failed. Please check your credentials." : error.message || 'Login failed';
      setErrors({ email: errorMessage });
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white/50 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back!</h2>
          <p className="text-gray-500 font-medium">Sign in to continue to your account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex mb-8 bg-gray-100/80 p-1.5 rounded-2xl relative">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-300 ease-spring ${role === 'user' ? 'left-1.5' : 'left-[calc(50%+4.5px)]'}`}
          ></div>
          <button
            type="button"
            onClick={() => { setRole('user'); setErrors({}); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${role === 'user' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>🐕</span> Pet Owner
          </button>
          <button
            type="button"
            onClick={() => { setRole('provider'); setErrors({}); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${role === 'provider' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span>🏥</span> Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.email
                  ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                  }`}
                placeholder={role === 'provider' ? "provider@example.com" : "you@example.com"}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.password
                  ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                  }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link href="/forget-password" className="text-sm font-semibold text-primary hover:text-orange-600 transition-colors hover:underline decoration-2 underline-offset-4">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10">Signing in...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-gray-500 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-primary hover:text-orange-600 transition-colors ml-1">
            Create one now
          </Link>
        </p>
      </div>
    </>
  );
}

