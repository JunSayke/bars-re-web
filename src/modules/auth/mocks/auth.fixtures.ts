import type { AuthUser, AuthError, ForgotPasswordResponse, ResetPasswordResponse } from "../types/auth.types"

export const mockAuthUser: AuthUser = {
  id: "mock-user-001",
  username: "bisaya_artist",
  email: "user@example.com",
  token: "mock-jwt-token-12345",
}

export const mockSignupUser: AuthUser = {
  id: "mock-user-002",
  username: "new_user",
  email: "new@example.com",
  token: "mock-jwt-token-67890",
}

export const mockInvalidCredentialsError: AuthError = {
  code: "INVALID_CREDENTIALS",
  message: "Invalid email or password.",
}

export const mockUsernameTakenError: AuthError = {
  code: "USERNAME_TAKEN",
  message: "That username is already taken.",
}

export const mockForgotPasswordSuccess: ForgotPasswordResponse = {
  message: "If that email exists, a reset link has been sent.",
}

export const mockForgotPasswordError: AuthError = {
  code: "INTERNAL_ERROR",
  message: "Failed to send reset email. Please try again.",
}

export const mockResetPasswordSuccess: ResetPasswordResponse = {
  message: "Password updated successfully.",
}

export const mockResetPasswordError: AuthError = {
  code: "INVALID_TOKEN",
  message: "This reset link is invalid or has expired.",
}
