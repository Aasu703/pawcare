'use client';

import { useState } from 'react';
import { registerSchema } from '../schema';
import Link from 'next/link';
import { handleRegister, handleProviderRegister } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, Phone, Building, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

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
      <div className="w-full bg-white/80 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white/50 backdrop-blur-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-gray-500 font-medium">Get started with your free account</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {role === 'user' ? (
            <>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="Firstname" className="block text-sm font-bold text-gray-700 ml-1">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors ${errors.Firstname ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                    </div>
                    <input
                      id="Firstname"
                      name="Firstname"
                      type="text"
                      value={formData.Firstname}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.Firstname
                        ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                        }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.Firstname && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.Firstname}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="Lastname" className="block text-sm font-bold text-gray-700 ml-1">
                    Last Name
                  </label>
                  <input
                    id="Lastname"
                    name="Lastname"
                    type="text"
                    value={formData.Lastname}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.Lastname
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="Doe"
                  />
                  {errors.Lastname && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.Lastname}</p>}
                </div>
              </div>

              {/* Email */}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.email
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className={`h-5 w-5 transition-colors ${errors.phoneNumber ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.phoneNumber
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phoneNumber && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.phoneNumber}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.password
                        ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                        }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 ml-1">
                    Confirm
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.confirmPassword
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.confirmPassword}</p>}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Provider Fields */}
              <div className="space-y-2">
                <label htmlFor="businessName" className="block text-sm font-bold text-gray-700 ml-1">
                  Business Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className={`h-5 w-5 transition-colors ${errors.businessName ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={providerFormData.businessName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.businessName
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="Your Clinic Name"
                  />
                </div>
                {errors.businessName && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.businessName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-bold text-gray-700 ml-1">
                  Business Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className={`h-5 w-5 transition-colors ${errors.address ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={providerFormData.address}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.address
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="123 Main St, City"
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 ml-1">
                    Phone
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className={`h-5 w-5 transition-colors ${errors.phone ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={providerFormData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.phone
                        ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                        }`}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="providerEmail" className="block text-sm font-bold text-gray-700 ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                    </div>
                    <input
                      id="providerEmail"
                      name="email"
                      type="email"
                      value={providerFormData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.email
                        ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                        }`}
                      placeholder="clinic@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="providerPassword" className="block text-sm font-bold text-gray-700 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-primary'}`} />
                    </div>
                    <input
                      id="providerPassword"
                      name="password"
                      type="password"
                      value={providerFormData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.password
                        ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                        }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="providerConfirmPassword" className="block text-sm font-bold text-gray-700 ml-1">
                    Confirm
                  </label>
                  <input
                    id="providerConfirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={providerFormData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 ${errors.confirmPassword
                      ? 'border-red-100 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10'
                      }`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs pl-1 font-medium flex items-center gap-1 animate-slide-up">⚠️ {errors.confirmPassword}</p>}
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden mt-6"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="relative z-10">Creating account...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-500 font-medium">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:text-orange-600 transition-colors ml-1">
            Sign in here
          </Link>
        </p>
      </div>
    </>
  );
}

