import apiClient, { ApiResponse } from '@/lib/api-client';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from '@/types';
import Cookies from 'js-cookie';

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      '/auth/register',
      data
    );
    return response.data.data;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );

    const { accessToken, refreshToken, user } = response.data.data;

    // Store tokens
    Cookies.set('accessToken', accessToken, { expires: 1/96 }); // 15 minutes
    localStorage.setItem('accessToken', accessToken);
    
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 days
    }

    return response.data.data;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('accessToken');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh-token',
      { refreshToken }
    );

    const { accessToken } = response.data.data;
    
    // Update access token
    Cookies.set('accessToken', accessToken, { expires: 1/96 });
    localStorage.setItem('accessToken', accessToken);

    return accessToken;
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.get(`/auth/verify-email/${token}`);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  /**
   * Get current user from token
   */
  getCurrentUser(): User | null {
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    
    if (!token) {
      return null;
    }

    try {
      // Decode JWT token (simplified - in production use a proper JWT library)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        firstName: payload.firstName || '',
        lastName: payload.lastName || '',
        emailVerified: true,
        createdAt: '',
        updatedAt: '',
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
    return !!token;
  }
}

export default new AuthService();
