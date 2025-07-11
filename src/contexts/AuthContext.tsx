import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Department } from '@/types';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  isProfileChecked: boolean;
  setProfileChecked: (checked: boolean) => void;
  googleLogin: (userData: User) => void;
  logout: () => void;
  switchDepartment: (department: Department) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isProfileChecked, setProfileChecked] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // If a user from storage has a department, we know their profile is complete.
      if (parsedUser.department) {
        setProfileChecked(true);
      }
    }
    setAuthLoading(false);
  }, []);

  const googleLogin = (userData: User) => {
    // This just sets the user in state. The AuthGate will handle the rest.
    setUser(userData);
    setProfileChecked(false); // Reset so the AuthGate runs the check
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setProfileChecked(false);
    localStorage.removeItem('user');
    // Navigation will be handled by the component that calls logout, or by a redirect in the router
  };

  const switchDepartment = (department: Department) => {
    if (user) {
      const updatedUser = { ...user, department };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, isProfileChecked, setProfileChecked, googleLogin, logout, switchDepartment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
