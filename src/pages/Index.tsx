
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import DashboardLayout from '@/components/DashboardLayout';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </div>
    </SidebarProvider>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
