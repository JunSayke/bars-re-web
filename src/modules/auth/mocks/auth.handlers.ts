import { http, HttpResponse } from "msw"
import {
  mockAuthUser,
  mockSignupUser,
  mockInvalidCredentialsError,
  mockUsernameTakenError,
  mockForgotPasswordSuccess,
  mockForgotPasswordError,
  mockResetPasswordSuccess,
  mockResetPasswordError,
} from "./auth.fixtures"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { identifier: string }
    if (body.identifier === "error@test.com") {
      return HttpResponse.json(mockInvalidCredentialsError, { status: 401 })
    }
    return HttpResponse.json({ ...mockAuthUser, email: body.identifier })
  }),

  http.post(`${BASE}/auth/signup`, async ({ request }) => {
    const body = await request.json() as { username: string; email: string }
    if (body.username === "reserved_user") {
      return HttpResponse.json(mockUsernameTakenError, { status: 409 })
    }
    return HttpResponse.json({ ...mockSignupUser, username: body.username, email: body.email })
  }),

  http.post(`${BASE}/auth/forgot-password`, async ({ request }) => {
    const body = await request.json() as { email: string }
    if (body.email === "fail@test.com") {
      return HttpResponse.json(mockForgotPasswordError, { status: 500 })
    }
    return HttpResponse.json(mockForgotPasswordSuccess)
  }),

  http.post(`${BASE}/auth/reset-password`, async ({ request }) => {
    const body = await request.json() as { token: string }
    if (body.token === "invalid-token") {
      return HttpResponse.json(mockResetPasswordError, { status: 400 })
    }
    return HttpResponse.json(mockResetPasswordSuccess)
  }),
]
