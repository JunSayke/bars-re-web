"use client"

import { useMutation } from "@tanstack/react-query"
import { signInWithGoogle } from "../services/auth.service"
import type { AuthError } from "../types/auth.types"

export function useGoogleAuthMutation() {
  const { mutate, isPending, error } = useMutation<void, AuthError>({
    mutationFn: signInWithGoogle,
  })
  return { mutate, isPending, error }
}
