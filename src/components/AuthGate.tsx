import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AuthGate: React.FC = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authLoading) {
      return; // Wait until the initial auth state is determined
    }

    const isPublicRoute = ['/login', '/profile-setup'].includes(location.pathname);

    // Case 1: User is not logged in
    if (!user) {
      if (!isPublicRoute) {
        navigate('/login');
      }
      return;
    }

    // Case 2: User is logged in but profile is incomplete
    if (!user.department) {
      if (location.pathname !== '/profile-setup') {
        navigate('/profile-setup');
      }
      return;
    }

    // Case 3: User is logged in with a complete profile
    const validHome = ['/orders', '/product-dev', '/costing', '/production', '/inventory', '/'].includes(user.preferredHomepage)
      ? user.preferredHomepage
      : '/';
    navigate(validHome);

  }, [user, authLoading, location.pathname, navigate]);

  // Render a loading indicator while checking auth status
  if (authLoading) {
    return <div>Loading...</div>; 
  }

  // If logic passes, render the requested child component
  return <Outlet />;
};