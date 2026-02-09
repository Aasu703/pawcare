'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ForgotPasswordData, forgotPasswordSchema } from '../schema';
import { handleForgotPassword } from '@/lib/actions/auth-actions';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const ForgetPasswordForm = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError, watch } = useForm<ForgotPasswordData>({
        mode: 'onSubmit',
        resolver: zodResolver(forgotPasswordSchema),
    });
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setErrorState] = useState<string | null>(null);
    const email = watch('email', '');
    const onSubmit = async (values: ForgotPasswordData) => {
        setErrorState(null);
        setLoading(true);
        try {
                const response = await handleForgotPassword(values.email);
                if(response.success){
                    toast.success('Password reset email sent! Check your inbox.');
                    return router.push('/login');
                }else{
                    setErrorState(response.message || 'Failed to send password reset email');
                }
            } catch (error) {
                setErrorState('An unexpected error occurred. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the email?{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Try again
              </button>
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
              placeholder="Email address"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgetPasswordForm;
