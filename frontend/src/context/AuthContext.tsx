import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
}

const DEMO_USER: User = {
  id: 'USR-891024',
  name: 'Marcus Vance',
  email: 'm.vance@finguard.ai',
  role: 'Chief Risk Officer & Principal ML Engineer',
  securityLevel: 'Tier-4 Sovereign Clearance',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('finguard_user');
    return saved ? JSON.parse(saved) : DEMO_USER; // Default to authenticated for instant interview & review showcase
  });

  const login = async (email: string, _pass: string, remember: boolean): Promise<boolean> => {
    // Simulated institutional auth check
    const newUser: User = {
      id: `USR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: 'Senior Financial Risk Analyst',
      securityLevel: 'Tier-3 Clearance'
    };
    setUser(newUser);
    if (remember) {
      localStorage.setItem('finguard_user', JSON.stringify(newUser));
    }
    return true;
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    localStorage.setItem('finguard_user', JSON.stringify(DEMO_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finguard_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
