"use client"

import { useMutation } from "@tanstack/react-query"
import { loginUser } from "../services/auth.service"
import type { LoginDto } from "../schemas/auth.schema"
import type { AuthUser, AuthError } from "../types/auth.types"

export function useLoginMutation() {
  const { mutate, isPending, error } = useMutation<AuthUser, AuthError, LoginDto>({
    mutationFn: loginUser,
  })
  return { mutate, isPending, error }
}
