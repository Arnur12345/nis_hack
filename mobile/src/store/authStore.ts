import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Pet } from '../types';
import * as authApi from '../api/auth';

interface AuthState {
  user: User | null;
  pet: Pet | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  setPet: (pet: Pet) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  pet: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    await AsyncStorage.setItem('access_token', data.access_token);
    set({ user: data.user, pet: data.pet, token: data.access_token, isAuthenticated: true });
  },

  register: async (email, password, username) => {
    try {
      const { data } = await authApi.register(email, password, username);
      await AsyncStorage.setItem('access_token', data.access_token);
      set({ user: data.user, pet: data.pet, token: data.access_token, isAuthenticated: true });
    } catch (error: any) {
      console.error('Register error:', JSON.stringify(error?.response?.data || error?.message || error, null, 2));
      console.error('Request URL:', error?.config?.url);
      console.error('Base URL:', error?.config?.baseURL);
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    set({ user: null, pet: null, token: null, isAuthenticated: false });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      try {
        const { data } = await authApi.getMe();
        set({ user: data.user, pet: data.pet, token, isAuthenticated: true, isLoading: false });
      } catch {
        await AsyncStorage.removeItem('access_token');
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  setPet: (pet) => set({ pet }),
}));
