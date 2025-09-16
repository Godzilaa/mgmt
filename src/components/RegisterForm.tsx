'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, RegisterRequest } from '@/lib/api';

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [registrationId, setRegistrationId] = useState('');
  const [verificationSid, setVerificationSid] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registerData: RegisterRequest = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      };

      const response = await authAPI.registerUser(registerData);
      
      if (response.success) {
        setRegistrationId(response.data.registrationId);
        setCurrentStep(2); // Move to email verification
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyEmail({
        registrationId,
        verificationCode: emailCode
      });
      
      if (response.success) {
        setCurrentStep(3); // Move to phone number entry
      } else {
        setError(response.message || 'Email verification failed');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setError(err instanceof Error ? err.message : 'Email verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.sendPhoneVerification({
        registrationId,
        phoneNumber: formData.phoneNumber
      });
      
      if (response.success) {
        setVerificationSid(response.data.verificationSid);
        setCurrentStep(4); // Move to phone verification
      } else {
        setError(response.message || 'Failed to send phone verification');
      }
    } catch (err) {
      console.error('Phone send error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send phone verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyPhone({
        registrationId,
        verificationSid,
        verificationCode: phoneCode
      });
      
      if (response.success) {
        // Registration complete, redirect to login
        alert('Registration completed successfully! Please log in.');
        router.push('/');
      } else {
        setError(response.message || 'Phone verification failed');
      }
    } catch (err) {
      console.error('Phone verification error:', err);
      setError(err instanceof Error ? err.message : 'Phone verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleUserRegistration} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            required
            value={formData.firstname}
            onChange={handleInputChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="First name"
          />
        </div>
        <div>
          <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            required
            value={formData.lastname}
            onChange={handleInputChange}
            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Last name"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleEmailVerification} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          We&apos;ve sent a verification code to <strong>{formData.email}</strong>
        </p>
      </div>
      
      <div>
        <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700">
          Email Verification Code
        </label>
        <input
          id="emailCode"
          name="emailCode"
          type="text"
          required
          value={emailCode}
          onChange={(e) => setEmailCode(e.target.value)}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center text-lg tracking-widest"
          placeholder="Enter code"
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !emailCode}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={handlePhoneSend} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Please enter your phone number to receive a verification code
        </p>
      </div>
      
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          required
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="+1234567890"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !formData.phoneNumber}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Sending Code...' : 'Send Verification Code'}
      </button>
    </form>
  );

  const renderStep4 = () => (
    <form onSubmit={handlePhoneVerification} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          We&apos;ve sent a verification code to <strong>{formData.phoneNumber}</strong>
        </p>
      </div>
      
      <div>
        <label htmlFor="phoneCode" className="block text-sm font-medium text-gray-700">
          Phone Verification Code
        </label>
        <input
          id="phoneCode"
          name="phoneCode"
          type="text"
          required
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center text-lg tracking-widest"
          placeholder="Enter code"
          maxLength={6}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !phoneCode}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Completing Registration...' : 'Complete Registration'}
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Create Your Account';
      case 2: return 'Verify Your Email';
      case 3: return 'Add Phone Number';
      case 4: return 'Verify Phone Number';
      default: return 'Registration';
    }
  };

  const getCurrentStepForm = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getStepTitle()}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Step {currentStep} of 4
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {getCurrentStepForm()}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}