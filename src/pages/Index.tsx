
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import CostingCalculator from '@/components/CostingCalculator';
import SourcingManagement from '@/components/SourcingManagement';
import ProductionScheduler from '@/components/ProductionScheduler';
import DashboardLayout from '@/components/DashboardLayout';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'costing':
        return <CostingCalculator />;
      case 'sourcing':
        return <SourcingManagement />;
      case 'production':
        return <ProductionScheduler />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardLayout onNavigate={setCurrentView} currentView={currentView}>
          {renderContent()}
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
