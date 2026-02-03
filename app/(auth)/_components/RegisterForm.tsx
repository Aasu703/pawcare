'use client';

import { useState } from 'react';
import { registerSchema } from '../schema';
import Link from 'next/link';
import { handleRegister } from '@/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Firstname: '',
    Lastname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TODO: Add onSubmit handler when registration action and router are implemented.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
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

      // Call register action (sets auth cookies server-side if provided)
      const response = await handleRegister(result.data);
      
      if (response.success) {
        // Use hard navigation to trigger proxy redirect
        const redirectPath = response.data?.role === 'admin' ? '/admin' : '/user/home';
        window.location.href = redirectPath;
      } else {
        setErrors({ Firstname: response.message || 'Registration failed' });
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Register error:', error);
      setErrors({ Firstname: error.message || 'Registration failed' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f4f57] to-[#0c4148]">
      <div className="w-full max-w-md bg-[#0c4148] border border-[#f8d548]/40 p-8 rounded-2xl shadow-xl shadow-yellow-500/20">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label htmlFor="Firstname" className="block text-sm font-medium text-[#f8d548]">
              First Name
            </label>
            <input
              id="Firstname"
              name="Firstname"
              type="text"
              value={formData.Firstname}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.Firstname ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your first name"
            />
            {errors.Firstname && <p className="text-red-500 text-sm mt-1">{errors.Firstname}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="Lastname" className="block text-sm font-medium text-[#f8d548]">
              Last Name
            </label>
            <input
              id="Lastname"
              name="Lastname"
              type="text"
              value={formData.Lastname}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.Lastname ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your last name"
            />
            {errors.Lastname && <p className="text-red-500 text-sm mt-1">{errors.Lastname}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#f8d548]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#f8d548]">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#f8d548]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#f8d548]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg bg-[#0b3238] text-white focus:outline-none focus:ring-2 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-[#f8d548]/60 focus:ring-[#f8d548]'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f8d548] hover:brightness-95 disabled:bg-yellow-300 text-[#0c4148] font-semibold py-2 rounded-lg transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-200">
          Already have an account?{' '}
          <Link href="/login" className="text-[#f8d548] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
