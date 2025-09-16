'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

interface UserProfile {
  userId: string;
  role: string;
  identifier?: string;
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userId = sessionStorage.getItem('userId');
    const userRole = sessionStorage.getItem('userRole');
    
    if (!userId || !userRole) {
      // If not authenticated, redirect to login
      router.push('/');
      return;
    }

    // Set user profile from session storage
    setUserProfile({
      userId,
      role: userRole,
      identifier: sessionStorage.getItem('userIdentifier') || undefined
    });
    
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear session storage regardless of API response
      sessionStorage.clear();
      router.push('/');
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'U_ADM':
        return 'Administrator';
      case 'U_DEF':
        return 'Default User';
      case 'U_PRAC':
        return 'Practitioner';
      case 'U_PAT':
        return 'Patient';
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null; // This shouldn't happen as we redirect above
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Management Portal</h1>
              <p className="text-sm text-gray-600">Welcome back!</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {userProfile.role.charAt(2)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
                    <p className="text-sm text-gray-500">Your account information</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">User ID:</span>
                    <span className="text-sm text-gray-900 font-mono">{userProfile.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Role:</span>
                    <span className="text-sm text-gray-900">{getRoleDisplayName(userProfile.role)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Role Code:</span>
                    <span className="text-sm text-gray-900 font-mono">{userProfile.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Status</h3>
                    <p className="text-sm text-gray-500">Account status</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-900">Active</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last login: Just now</p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white overflow-hidden shadow-lg rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-500">Common tasks</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    View API Documentation
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    Manage Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 bg-white shadow-lg rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Welcome to the Management Portal</h3>
              <p className="text-gray-600 mb-4">
                You have successfully logged into the management portal. This dashboard provides an overview of your account 
                and quick access to common features.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Your role is <strong>{getRoleDisplayName(userProfile.role)}</strong>. 
                      This determines your access level and available features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}