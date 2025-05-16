'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Mock user type - this would normally come from your auth provider
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock auth initialization
  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock Google sign in
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would call the actual Google OAuth API
      // For demo purposes, we'll create a mock user
      const mockUser: User = {
        uid: 'user123',
        email: 'user@example.com',
        displayName: 'Demo User',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast({
        title: 'Signed in successfully',
        description: 'Welcome to VoiceWave!',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock sign out
  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);