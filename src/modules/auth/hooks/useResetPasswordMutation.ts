"use client"

import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "../services/auth.service"
import type { ResetPasswordDto } from "../schemas/auth.schema"
import type { ResetPasswordResponse, AuthError } from "../types/auth.types"

export function useResetPasswordMutation() {
  const { mutate, isPending, error } = useMutation<
    ResetPasswordResponse,
    AuthError,
    ResetPasswordDto & { token: string }
  >({
    mutationFn: resetPassword,
  })
  return { mutate, isPending, error }
}
