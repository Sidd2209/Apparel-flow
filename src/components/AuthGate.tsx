import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_USER = gql`
  query GetUser($googleId: String!) {
    user(googleId: $googleId) {
      id
      username
      department
      preferredHomepage
    }
  }
`;

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const { user, authLoading, isProfileChecked, setProfileChecked } = useAuth();
  const navigate = useNavigate();

  const [getUser, { loading: userQueryLoading }] = useLazyQuery(GET_USER, {
    onCompleted: (data) => {
      if (data?.user?.department) {
        navigate(data.user.preferredHomepage);
      } else {
        navigate('/profile-setup');
      }
      setProfileChecked(true);
    },
    onError: () => {
      // Handle error, maybe navigate to a generic error page or back to login
      navigate('/login');
      setProfileChecked(true);
    },
  });

  useEffect(() => {
    // Only run the check if there's a user, it's not the initial load, and we haven't checked before
    if (user && !authLoading && !isProfileChecked) {
      if (!user.department) { // This implies a new Google login
        getUser({ variables: { googleId: user.id } });
      } else {
        // This is a returning user from local storage, profile is already known
        setProfileChecked(true);
      }
    }
  }, [user, authLoading, isProfileChecked, getUser, navigate, setProfileChecked]);

  // Render a loading screen while we check auth or user profile
  if (authLoading || userQueryLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return <>{children}</>;
};
