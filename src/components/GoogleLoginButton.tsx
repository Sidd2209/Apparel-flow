import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string, email: string, sub: string } = jwtDecode(credentialResponse.credential);
      
      // Create a partial User object to pass to the context
      const user: User = {
        id: decoded.sub, // Map Google's 'sub' to our 'id'
        name: decoded.name,
        email: decoded.email,
      };

      googleLogin(user);
    } else {
      console.error('Login failed: No credential returned from Google');
    }
  };

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
