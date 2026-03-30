// @module: auth
// @layer: service
// @scope: module
// @deps: @/shared/config/supabase, auth.types.ts, auth.schema.ts

import { supabase } from "@/shared/config/supabase"
import type { AuthUser, AuthError, ForgotPasswordResponse, ResetPasswordResponse } from "../types/auth.types"
import type { LoginDto, SignupDto, ForgotPasswordDto, ResetPasswordDto } from "../schemas/auth.schema"

function toAuthError(error: unknown): AuthError {
  if (error && typeof error === "object" && "message" in error) {
    return {
      message: (error as { message: string }).message,
      status: "status" in error ? (error as { status: number }).status : undefined,
    }
  }
  return { message: "An unexpected error occurred" }
}

export async function loginUser(dto: LoginDto): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: dto.identifier,
    password: dto.password,
  })

  if (error || !data.session) throw toAuthError(error)

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    accessToken: data.session.access_token,
  }
}

export async function signupUser(dto: SignupDto): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email: dto.email,
    password: dto.password,
  })

  if (error) throw toAuthError(error)

  // Supabase returns an empty identities array for already-registered emails
  // instead of an error, to prevent email enumeration
  if (!data.user || !data.session || data.user.identities?.length === 0) {
    throw { message: "An account with this email already exists.", status: 422 } satisfies AuthError
  }

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    accessToken: data.session.access_token,
  }
}

export async function forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
  const { error } = await supabase.auth.resetPasswordForEmail(dto.email)

  if (error) throw toAuthError(error)

  return { message: "Password reset email sent" }
}

export async function resetPassword(
  dto: ResetPasswordDto & { token: string }
): Promise<ResetPasswordResponse> {
  const { error } = await supabase.auth.updateUser({
    password: dto.newPassword,
  })

  if (error) throw toAuthError(error)

  return { message: "Password updated successfully" }
}

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw toAuthError(error)
}
