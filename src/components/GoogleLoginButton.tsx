import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();

  const handleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string, email: string, sub: string } = jwtDecode(credentialResponse.credential);

      // Create a user object that matches your app's User type
      const user: User = {
        id: decoded.sub, // Use Google's unique ID as the user ID
        name: decoded.name,
        email: decoded.email,
        // Assign default department and role
        department: 'management',
        role: 'associate'
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
