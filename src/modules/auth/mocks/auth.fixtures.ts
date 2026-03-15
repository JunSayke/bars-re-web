// @module: auth
// @layer: mock
// @scope: module
// @deps: auth.types.ts

import type { AuthUser, AuthError, ForgotPasswordResponse, ResetPasswordResponse } from "../types/auth.types"

export const mockAuthUser: AuthUser = {
  id: "mock-user-001",
  email: "user@example.com",
  accessToken: "mock-access-token-12345",
}

export const mockSignupUser: AuthUser = {
  id: "mock-user-002",
  email: "new@example.com",
  accessToken: "mock-access-token-67890",
}

export const mockSupabaseSession = {
  access_token: "mock-access-token-12345",
  refresh_token: "mock-refresh-token-12345",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 9999999999,
  user: {
    id: "mock-user-001",
    email: "user@example.com",
    role: "authenticated",
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
  },
}

export const mockSupabaseSignupResponse = {
  access_token: "mock-access-token-67890",
  refresh_token: "mock-refresh-token-67890",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: 9999999999,
  user: {
    id: "mock-user-002",
    email: "new@example.com",
    role: "authenticated",
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
  },
}

export const mockInvalidCredentialsError: AuthError = {
  message: "Invalid login credentials",
  status: 400,
}

export const mockEmailInUseError: AuthError = {
  message: "User already registered",
  status: 422,
}

export const mockForgotPasswordSuccess: ForgotPasswordResponse = {
  message: "Password reset email sent",
}

export const mockForgotPasswordError: AuthError = {
  message: "Failed to send reset email. Please try again.",
  status: 500,
}

export const mockResetPasswordSuccess: ResetPasswordResponse = {
  message: "Password updated successfully",
}

export const mockResetPasswordError: AuthError = {
  message: "This reset link is invalid or has expired.",
  status: 401,
}
