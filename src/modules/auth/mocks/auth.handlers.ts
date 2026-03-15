// @module: auth
// @layer: mock
// @scope: module
// @deps: auth.fixtures.ts

import { http, HttpResponse } from "msw"
import {
  mockSupabaseSession,
  mockSupabaseSignupResponse,
  mockInvalidCredentialsError,
  mockEmailInUseError,
  mockForgotPasswordSuccess,
  mockForgotPasswordError,
  mockResetPasswordSuccess,
  mockResetPasswordError,
} from "./auth.fixtures"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://localhost:54321"

export const authHandlers = [
  // Login — supabase.auth.signInWithPassword
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === "error@test.com") {
      return HttpResponse.json(mockInvalidCredentialsError, { status: 400 })
    }
    return HttpResponse.json({
      ...mockSupabaseSession,
      user: { ...mockSupabaseSession.user, email: body.email },
    })
  }),

  // Signup — supabase.auth.signUp
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === "taken@test.com") {
      return HttpResponse.json(mockEmailInUseError, { status: 422 })
    }
    return HttpResponse.json({
      ...mockSupabaseSignupResponse,
      user: { ...mockSupabaseSignupResponse.user, email: body.email },
    })
  }),

  // Forgot password — supabase.auth.resetPasswordForEmail
  http.post(`${SUPABASE_URL}/auth/v1/recover`, async ({ request }) => {
    const body = await request.json() as { email: string }
    if (body.email === "fail@test.com") {
      return HttpResponse.json(mockForgotPasswordError, { status: 500 })
    }
    return HttpResponse.json(mockForgotPasswordSuccess)
  }),

  // Reset password — supabase.auth.updateUser
  http.put(`${SUPABASE_URL}/auth/v1/user`, async ({ request }) => {
    const body = await request.json() as { password: string }
    if (body.password === "invalid") {
      return HttpResponse.json(mockResetPasswordError, { status: 401 })
    }
    return HttpResponse.json(mockResetPasswordSuccess)
  }),
]
