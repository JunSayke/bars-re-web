import type { LoginDto, SignupDto, ForgotPasswordDto, ResetPasswordDto } from "../schemas/auth.schema"
import type { AuthUser, AuthError, ForgotPasswordResponse, ResetPasswordResponse } from "../types/auth.types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err: AuthError = await res.json()
    throw err
  }
  return res.json() as Promise<T>
}

export async function loginUser(dto: LoginDto): Promise<AuthUser> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<AuthUser>(res)
}

export async function signupUser(dto: SignupDto): Promise<AuthUser> {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<AuthUser>(res)
}

export async function forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
  const res = await fetch(`${BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<ForgotPasswordResponse>(res)
}

export async function resetPassword(
  dto: ResetPasswordDto & { token: string }
): Promise<ResetPasswordResponse> {
  const res = await fetch(`${BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  return handleResponse<ResetPasswordResponse>(res)
}
