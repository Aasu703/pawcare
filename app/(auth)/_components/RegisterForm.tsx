'use client';

import { useState } from 'react';
import { registerSchema } from '../schema';
import Link from 'next/link';
import { handleRegister, handleProviderRegister } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[gray-900] to-[gray-900] py-12">
      <div className="w-full max-w-md bg-[gray-900] border border-[primary]/40 p-8 rounded-2xl shadow-xl shadow-primary/20">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>

        {/* Role Toggle */}
        <div className="flex mb-6 bg-[gray-800] rounded-lg p-1 border border-[primary]/30">
          <button
            type="button"
            onClick={() => { setRole('user'); setErrors({}); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              role === 'user'
                ? 'bg-[primary] text-[gray-900] shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => { setRole('provider'); setErrors({}); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              role === 'provider'
                ? 'bg-[primary] text-[gray-900] shadow-md'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Provider
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'user' ? (
            <>
              {/* First Name */}
              <div>
                <label htmlFor="Firstname" className="block text-sm font-medium text-[primary]">
                  First Name
                </label>
                <input
                  id="Firstname"
                  name="Firstname"
                  type="text"
                  value={formData.Firstname}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.Firstname ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.Firstname && <p className="text-red-500 text-sm mt-1">{errors.Firstname}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="Lastname" className="block text-sm font-medium text-[primary]">
                  Last Name
                </label>
                <input
                  id="Lastname"
                  name="Lastname"
                  type="text"
                  value={formData.Lastname}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.Lastname ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.Lastname && <p className="text-red-500 text-sm mt-1">{errors.Lastname}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[primary]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[primary]">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[primary]">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[primary]">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          ) : (
            <>
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-[primary]">
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={providerFormData.businessName}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.businessName ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Your business name"
                />
                {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[primary]">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={providerFormData.address}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Business address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[primary]">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={providerFormData.phone}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="providerEmail" className="block text-sm font-medium text-[primary]">
                  Email
                </label>
                <input
                  id="providerEmail"
                  name="email"
                  type="email"
                  value={providerFormData.email}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Business email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="providerPassword" className="block text-sm font-medium text-[primary]">
                  Password
                </label>
                <input
                  id="providerPassword"
                  name="password"
                  type="password"
                  value={providerFormData.password}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Create password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="providerConfirmPassword" className="block text-sm font-medium text-[primary]">
                  Confirm Password
                </label>
                <input
                  id="providerConfirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={providerFormData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[gray-800] text-white focus:outline-none focus:ring-2 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[primary]/60 focus:ring-[primary]'
                  }`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[primary] hover:bg-primary/90 disabled:bg-primary/50 text-[gray-900] font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Registering...' : `Register as ${role === 'provider' ? 'Provider' : 'User'}`}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-200">
          Already have an account?{' '}
          <Link href="/login" className="text-[primary] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

