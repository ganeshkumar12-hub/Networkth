import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { api, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: UserRole; headline?: string; industry?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  switchPersona: (email: string) => Promise<void>;
  authModal: {
    isOpen: boolean;
    mode: 'login' | 'signup' | 'onboarding';
  };
  openAuthModal: (mode?: 'login' | 'signup' | 'onboarding') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'onboarding' }>({
    isOpen: false,
    mode: 'login',
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch {
          removeAuthToken();
          setToken(null);
          setUser(null);
        }
      } else {
        // Auto-login default persona (Elena Rostova - Founder) so user immediately experiences rich full app
        try {
          const res = await api.login({ email: 'elena@synthai.io', password: 'password123' });
          setAuthToken(res.token);
          setToken(res.token);
          setUser(res.user);
        } catch {
          // Ignore if error
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password = 'password123') => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: UserRole; headline?: string; industry?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('Not logged in');
    const res = await api.updateUser(user.id, updates);
    setUser(res.user);
    return res.user;
  };

  const switchPersona = async (email: string) => {
    await login(email, 'password123');
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'onboarding' = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchPersona,
        authModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
