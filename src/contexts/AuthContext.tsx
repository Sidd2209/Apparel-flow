
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Department } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchDepartment: (department: Department) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    department: 'merchandising',
    role: 'manager'
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@company.com',
    department: 'logistics',
    role: 'coordinator'
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily.watson@company.com',
    department: 'procurement',
    role: 'associate'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'sampling',
    role: 'manager'
  },
  {
    id: '5',
    name: 'Jessica Thompson',
    email: 'jessica.thompson@company.com',
    department: 'management',
    role: 'admin'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const switchDepartment = (department: Department) => {
    if (user) {
      setUser({ ...user, department });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchDepartment }}>
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
