'use client';

import { useState } from 'react';
import { registerSchema } from '../schema';
import Link from 'next/link';
import { handleRegister, handleProviderRegister } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, Phone, Building, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import CursorAnimation from './CursorAnimation';

export default function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'provider'>('user');
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [providerFormData, setProviderFormData] = useState({
    businessName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (role === 'provider') {
      setProviderFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (role === 'provider') {
        // Provider registration
        if (providerFormData.password !== providerFormData.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          setLoading(false);
          return;
        }
        if (!providerFormData.businessName || providerFormData.businessName.length < 2) {
          setErrors({ businessName: 'Business name is required (min 2 characters)' });
          setLoading(false);
          return;
        }
        if (!providerFormData.address || providerFormData.address.length < 5) {
          setErrors({ address: 'Address is required (min 5 characters)' });
          setLoading(false);
          return;
        }
        if (!providerFormData.email) {
          setErrors({ email: 'Email is required' });
          setLoading(false);
          return;
        }
        if (!providerFormData.password || providerFormData.password.length < 8) {
          setErrors({ password: 'Password must be at least 8 characters' });
          setLoading(false);
          return;
        }

        const response = await handleProviderRegister(providerFormData);

        if (response.success) {
          window.location.href = '/provider/dashboard';
        } else {
          setErrors({ businessName: response.message || 'Registration failed' });
        }
      } else {
        // User registration
        const result = registerSchema.safeParse(formData);

        if (!result.success) {
          const fieldErrors = result.error.flatten().fieldErrors;
          const newErrors: Record<string, string> = {};
          Object.entries(fieldErrors).forEach(([key, messages]) => {
            if (messages) newErrors[key] = messages[0];
          });
          setErrors(newErrors);
          setLoading(false);
          return;
        }

        const payload = {
          ...result.data,
          phone: formData.phoneNumber,
        } as any;

        const response = await handleRegister(payload);

        if (response.success) {
          const redirectPath = response.data?.role === 'admin' ? '/admin' : '/user/home';
          window.location.href = redirectPath;
        } else {
          setErrors({ Firstname: response.message || 'Registration failed' });
        }
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Register error:', error);
      const errorKey = role === 'provider' ? 'businessName' : 'Firstname';
      setErrors({ [errorKey]: error.message || 'Registration failed' });
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
                Join the<br />
                <span className="text-6xl bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                  PawCare Family
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Start your journey to better pet care today. Join thousands of happy pet owners! 🐾
              </p>

              {/* Benefits */}
              <div className="space-y-4 text-left">
                {[
                  { icon: <CheckCircle className="w-6 h-6" />, text: 'Free account forever' },
                  { icon: <CheckCircle className="w-6 h-6" />, text: 'Unlimited pet profiles' },
                  { icon: <CheckCircle className="w-6 h-6" />, text: 'Smart health reminders' },
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-white">{benefit.icon}</div>
                    <span className="text-white/90">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white relative overflow-y-auto">
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

          <div className="w-full max-w-md mt-20 lg:mt-0 py-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Get started with your free account</p>
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {role === 'user' ? (
                <>
                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="Firstname" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="Firstname"
                          name="Firstname"
                          type="text"
                          value={formData.Firstname}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.Firstname ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                          placeholder="John"
                        />
                      </div>
                      {errors.Firstname && <p className="text-red-500 text-xs mt-1">⚠️ {errors.Firstname}</p>}
                    </div>

                    <div>
                      <label htmlFor="Lastname" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="Lastname"
                        name="Lastname"
                        type="text"
                        value={formData.Lastname}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.Lastname ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="Doe"
                      />
                      {errors.Lastname && <p className="text-red-500 text-xs mt-1">⚠️ {errors.Lastname}</p>}
                    </div>
                  </div>

                  {/* Email */}
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
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phoneNumber}</p>}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirmPassword}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Provider Fields */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        value={providerFormData.businessName}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.businessName ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="Your Clinic Name"
                      />
                    </div>
                    {errors.businessName && <p className="text-red-500 text-xs mt-1">⚠️ {errors.businessName}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        value={providerFormData.address}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="123 Main St, City"
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1">⚠️ {errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={providerFormData.phone}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                          placeholder="(555) 000-0000"
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
                    </div>

                    <div>
                      <label htmlFor="providerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="providerEmail"
                          name="email"
                          type="email"
                          value={providerFormData.email}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                          placeholder="clinic@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">⚠️ {errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="providerPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="providerPassword"
                          name="password"
                          type="password"
                          value={providerFormData.password}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                            }`}
                          placeholder="••••••••"
                        />
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
                    </div>

                    <div>
                      <label htmlFor="providerConfirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm
                      </label>
                      <input
                        id="providerConfirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={providerFormData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-primary'
                          }`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠️ {errors.confirmPassword}</p>}
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-orange-600 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
