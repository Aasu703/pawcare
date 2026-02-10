'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginSchema } from '../schema';
import Link from 'next/link';
import { handleLogin, handleProviderLogin } from '@/lib/actions/auth-actions';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { PawPrint, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import CursorAnimation from './CursorAnimation';

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
        console.log('✅ Login successful, user role:', response.data?.role);

        // Update auth context with user data
        await checkAuth(response.data);

        // Hard redirect — ensures cookies are sent to server and middleware handles routing
        const redirectPath = response.data.role === 'admin' ? '/admin' : response.data.role === 'provider' ? '/provider/dashboard' : '/user/home';
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
    <>
      <CursorAnimation />
      <div className="min-h-screen flex">
        {/* Left Side - Branding & Visual */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-orange-500 to-orange-600 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-black/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
            <div className="max-w-md text-center">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/pawcare.png"
                    alt="PawCare"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              </div>

              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Welcome to<br />
                <span className="text-6xl bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  PawCare
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Your trusted companion for pet health management. Keep your furry friends happy and healthy! 🐾
              </p>

              {/* Features */}
              <div className="space-y-4 text-left">
                {[
                  { icon: '🏥', text: 'Track health records & appointments' },
                  { icon: '📅', text: 'Never miss vaccination dates' },
                  { icon: '💊', text: 'Medication reminders & tracking' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <span className="text-3xl">{feature.icon}</span>
                    <span className="text-white/90">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative">
          {/* Mobile Logo */}
          <div className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image src="/images/pawcare.png" alt="PawCare" width={48} height={48} className="object-cover" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                PawCare
              </span>
            </div>
          </div>

          <div className="w-full max-w-md mt-20 lg:mt-0">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>

            {/* Role Toggle */}
            <div className="flex mb-8 bg-gray-100 rounded-2xl p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => { setRole('user'); setErrors({}); }}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${role === 'user'
                    ? 'bg-white text-primary shadow-lg shadow-primary/20 scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                🐕 Pet Owner
              </button>
              <button
                type="button"
                onClick={() => { setRole('provider'); setErrors({}); }}
                className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${role === 'provider'
                    ? 'bg-white text-primary shadow-lg shadow-primary/20 scale-105'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                🏥 Provider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                      }`}
                    placeholder={role === 'provider' ? "provider@example.com" : "you@example.com"}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-primary'
                      }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {errors.password}</p>}
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link href="/forget-password" className="text-sm font-medium text-primary hover:text-orange-600 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:text-orange-600 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
