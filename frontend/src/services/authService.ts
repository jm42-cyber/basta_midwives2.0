import api from './api';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/register', userData);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>('/me');
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  async verifyPassword(password: string): Promise<{ valid: boolean; message: string }> {
    const { data } = await api.post('/verify-password', { password });
    return data;
  },

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
