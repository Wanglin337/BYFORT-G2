import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  isVerified: boolean;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('byfort_token'),
    isLoading: true,
    isAuthenticated: false,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('byfort_token');
    if (token) {
      validateToken(token);
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const user = await response.json();
        setAuthState({
          user,
          token,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem('byfort_token');
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      localStorage.removeItem('byfort_token');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      const data = await response.json();
      
      localStorage.setItem('byfort_token', data.token);
      setAuthState({
        user: data.user,
        token: data.token,
        isLoading: false,
        isAuthenticated: true,
      });
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.displayName}`,
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }) => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', userData);
      const data = await response.json();
      
      localStorage.setItem('byfort_token', data.token);
      setAuthState({
        user: data.user,
        token: data.token,
        isLoading: false,
        isAuthenticated: true,
      });
      
      toast({
        title: "Welcome to BYFORT!",
        description: `Account created successfully`,
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('byfort_token');
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
    
    toast({
      title: "Goodbye!",
      description: "You have been logged out",
    });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}
