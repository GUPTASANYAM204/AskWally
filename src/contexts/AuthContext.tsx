import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  role?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SIGNUP_FAILURE' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'SIGNUP_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; errors?: any[] }>;
  signup: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string; errors?: any[] }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('askwally-user');
    const savedToken = localStorage.getItem('askwally-token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: userData, token: savedToken } 
        });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('askwally-user');
        localStorage.removeItem('askwally-token');
      }
    }
  }, []);

  // Save user and token to localStorage whenever they change
  useEffect(() => {
    if (state.user && state.token) {
      localStorage.setItem('askwally-user', JSON.stringify(state.user));
      localStorage.setItem('askwally-token', state.token);
    } else {
      localStorage.removeItem('askwally-user');
      localStorage.removeItem('askwally-token');
    }
  }, [state.user, state.token]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string; errors?: any[] }> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      console.log('🚀 Attempting login with email:', email);
      console.log('📡 Making request to:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        const user: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          role: data.data.user.role,
          isEmailVerified: data.data.user.isEmailVerified,
          createdAt: new Date(data.data.user.createdAt || Date.now()),
        };

        console.log('✅ Login successful, user:', user);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user, token: data.data.token } 
        });
        return { success: true };
      } else {
        console.error('❌ Login failed:', data.message);
        dispatch({ type: 'LOGIN_FAILURE' });
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const signup = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ success: boolean; message?: string; errors?: any[] }> => {
    dispatch({ type: 'SIGNUP_START' });
    
    try {
      console.log('🚀 Attempting signup with data:', userData);
      console.log('📡 Making request to:', `${API_BASE_URL}/auth/register`);
      
      // Map 'phone' to 'phoneNumber' for backend compatibility
      const payload = {
        ...userData,
        phoneNumber: userData.phone,
      };
      delete payload.phone;

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok && data.success) {
        const user: User = {
          id: data.data.user.id,
          email: data.data.user.email,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          role: data.data.user.role,
          isEmailVerified: data.data.user.isEmailVerified,
          createdAt: new Date(data.data.user.createdAt || Date.now()),
        };

        console.log('✅ Signup successful, user created:', user);
        dispatch({ 
          type: 'SIGNUP_SUCCESS', 
          payload: { user, token: data.data.token } 
        });
        return { success: true };
      } else {
        console.error('❌ Signup failed:', data.message);
        if (data.errors) {
          console.error('❌ Validation errors:', data.errors);
        }
        dispatch({ type: 'SIGNUP_FAILURE' });
        return { success: false, message: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      dispatch({ type: 'SIGNUP_FAILURE' });
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if we have a token
      if (state.token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          },
          body: JSON.stringify({ refreshToken: localStorage.getItem('askwally-refresh-token') }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = (data: Partial<User>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
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