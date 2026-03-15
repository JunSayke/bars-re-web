"use client"

import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "../services/auth.service"
import type { ForgotPasswordDto } from "../schemas/auth.schema"
import type { ForgotPasswordResponse, AuthError } from "../types/auth.types"

export function useForgotPasswordMutation() {
  const { mutate, isPending, error, isSuccess } = useMutation<
    ForgotPasswordResponse,
    AuthError,
    ForgotPasswordDto
  >({
    mutationFn: forgotPassword,
  })
  return { mutate, isPending, error, isSuccess }
}
