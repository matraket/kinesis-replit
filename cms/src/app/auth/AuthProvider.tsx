import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { config } from '@/shared/config';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedSecret = localStorage.getItem(config.adminSecretStorageKey);
    if (storedSecret) {
      setAdminSecret(storedSecret);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (secret: string) => {
    localStorage.setItem(config.adminSecretStorageKey, secret);
    setAdminSecret(secret);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(config.adminSecretStorageKey);
    setAdminSecret(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminSecret, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
