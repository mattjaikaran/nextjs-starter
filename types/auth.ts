import type { User } from './user';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DjangoJWTTokens {
  access: string;
  refresh: string;
}

export function normalizeTokens(
  tokens: AuthTokens | DjangoJWTTokens
): AuthTokens {
  if ('access' in tokens) {
    return {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    };
  }
  return tokens;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface MagicLinkRequest {
  email: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
