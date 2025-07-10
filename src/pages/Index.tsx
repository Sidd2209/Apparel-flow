import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import GoogleLoginButton from '@/components/GoogleLoginButton';

const Index: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="m-auto flex flex-col items-center p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center">
            Welcome to ApparelOS 
          </h1>
          <p className="text-gray-600 mb-8 text-center">Please sign in with your Google account to continue</p>
          <GoogleLoginButton />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </DashboardLayout>
  );
};

export default Index;