import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApolloClient } from '@apollo/client';
import { User, Department } from '@/types';

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  googleLogin: (userData: User) => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  logout: () => void;
  switchDepartment: (department: Department) => void;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const client = useApolloClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // If a user from storage has a department, we know their profile is complete.
      if (parsedUser.department) {
        // Removed setProfileChecked(true);
      }
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (user && (!user.name || !user.department)) {
      // Removed navigation here
    }
  }, [user]);

  const googleLogin = (userData: User) => {
    // This just sets the user in state. The AuthGate will handle the rest.
    setUser(userData);
    // Removed setProfileChecked(false); 
    localStorage.setItem('authToken', userData.token || '');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      // Removed setProfileChecked(false); 
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    await client.resetStore(); // Reset Apollo Client cache
  };

  const switchDepartment = (department: Department) => {
    if (user) {
      const updatedUser = { ...user, department };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Placeholder login function for email/password
  const login = async (email: string, password: string) => {
    // You can implement real authentication here later
    throw new Error('Email/password login not implemented. Use Google login.');
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, googleLogin, updateUserProfile, logout, switchDepartment, login }}>
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
