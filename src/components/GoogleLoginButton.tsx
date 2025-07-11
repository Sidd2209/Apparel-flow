import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const [getUser, { data, loading, error }] = useLazyQuery(GET_USER);

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string, email: string, sub: string } = jwtDecode(credentialResponse.credential);
      
      // Temporarily store basic info and trigger user check
      const basicUser: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
      };
      googleLogin(basicUser); // Log in locally first

      // Check if user exists on the backend
      getUser({ variables: { googleId: decoded.sub } });
    } else {
      console.error('Login failed: No credential returned from Google');
    }
  };

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.error('Error fetching user profile:', error);
      // Potentially navigate to an error page or show a toast
      return;
    }

    if (data) {
      if (data.user && data.user.department) {
        // User exists and has completed profile, redirect to their homepage
        navigate(data.user.preferredHomepage);
      } else {
        // New user or incomplete profile, redirect to setup
        navigate('/profile-setup');
      }
    }
  }, [data, loading, error, navigate]);

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleLoginButton;
