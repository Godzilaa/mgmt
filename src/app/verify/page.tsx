'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, VerifyRequest } from '@/lib/api';

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get verification ID from sessionStorage
    const storedVerificationId = sessionStorage.getItem('verificationId');
    if (!storedVerificationId) {
      // If no verification ID, redirect back to login
      router.push('/');
      return;
    }
    setVerificationId(storedVerificationId);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Verification attempt with:', {
        verificationId: verificationId,
        tokenLength: verificationCode.length,
        hasVerificationId: !!verificationId
      });

      if (!verificationId) {
        setError('No verification ID found. Please try logging in again.');
        setLoading(false);
        return;
      }

      const verifyData: VerifyRequest = {
        verificationId,
        token: verificationCode
      };

      const response = await authAPI.verifyLogin(verifyData);
      
      if (response.success) {
        // Store any additional user data if provided
        if (response.data) {
          sessionStorage.setItem('userToken', JSON.stringify(response.data));
        }
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          setError('Verification code expired or invalid. Please try logging in again.');
        } else if (err.message.includes('Verification not found')) {
          setError('Verification session expired. Please log in again.');
        } else if (err.message.includes('CORS')) {
          setError('Unable to connect to the API server. Please contact the administrator.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    // You could implement resend functionality here if your API supports it
    alert('Resend code functionality can be implemented based on your API requirements');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the verification code sent to your email
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {/* Debug information - remove in production */}
          {verificationId && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-xs">
              <strong>Debug:</strong> Verification ID: {verificationId.substring(0, 8)}...
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                placeholder="Enter code"
                maxLength={6}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !verificationCode}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Didn&apos;t receive a code? Resend
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Back to login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
