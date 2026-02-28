import { api, handleApiResponse } from '@/lib/api';
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  MagicLinkRequest,
  RegisterCredentials,
  User,
} from '@/types';
import { createQueryKeyFactory } from '../utils/query-keys';

export const authKeys = {
  ...createQueryKeyFactory('auth'),
  profile: () => ['auth', 'profile'] as const,
  session: () => ['auth', 'session'] as const,
};

class AuthServiceClass {
  private readonly basePath = '/auth';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/login`,
      credentials
    );
    return handleApiResponse(response);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/register`,
      credentials
    );
    return handleApiResponse(response);
  }

  async sendMagicLink(request: MagicLinkRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${this.basePath}/magic-link`,
      request
    );
    return handleApiResponse(response);
  }

  async verifyMagicLink(token: string): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      `${this.basePath}/verify-magic-link`,
      { token }
    );
    return handleApiResponse(response);
  }

  async logout(): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${this.basePath}/logout`
    );
    return handleApiResponse(response);
  }

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      `${this.basePath}/profile`
    );
    return handleApiResponse(response);
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(
      `${this.basePath}/profile`,
      updates
    );
    return handleApiResponse(response);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${this.basePath}/change-password`,
      data
    );
    return handleApiResponse(response);
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${this.basePath}/request-password-reset`,
      { email }
    );
    return handleApiResponse(response);
  }

  async resetPassword(data: {
    token: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${this.basePath}/reset-password`,
      data
    );
    return handleApiResponse(response);
  }
}

export const authService = new AuthServiceClass();
