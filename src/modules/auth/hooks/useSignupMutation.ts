"use client"

import { useMutation } from "@tanstack/react-query"
import { signupUser } from "../services/auth.service"
import type { SignupDto } from "../schemas/auth.schema"
import type { AuthUser, AuthError } from "../types/auth.types"

export function useSignupMutation() {
  const { mutate, isPending, error } = useMutation<AuthUser, AuthError, SignupDto>({
    mutationFn: signupUser,
  })
  return { mutate, isPending, error }
}
