import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AuthGate: React.FC = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading) return;

    const isPublicRoute = ['/login', '/profile-setup'].includes(location.pathname);

    if (!user) {
      if (!isPublicRoute) {
        navigate('/login');
      }
      return;
    }

    if (!user.department) {
      if (location.pathname !== '/profile-setup') {
        navigate('/profile-setup');
      }
      return;
    }

    // Only redirect to preferred homepage if on root
    if (location.pathname === '/') {
      const validHome = ['/orders', '/product-dev', '/costing', '/production', '/inventory', '/'].includes(user.preferredHomepage)
        ? user.preferredHomepage
        : '/orders';
      navigate(validHome, { replace: true });
    }
  }, [user, authLoading, location.pathname, navigate]);

  // Render a loading indicator while checking auth status
  if (authLoading) {
    return <div>Loading...</div>; 
  }

  // If logic passes, render the requested child component
  return <Outlet />;
};