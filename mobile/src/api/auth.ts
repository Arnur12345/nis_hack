import client from './client';
import { AuthResponse } from '../types';

export const register = (email: string, password: string, username: string) =>
  client.post<AuthResponse>('/api/v1/auth/register', { email, password, username });

export const login = (email: string, password: string) =>
  client.post<AuthResponse>('/api/v1/auth/login', { email, password });

export const getMe = () =>
  client.get<{ user: any; pet: any }>('/api/v1/auth/me');
