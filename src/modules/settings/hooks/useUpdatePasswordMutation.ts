"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { supabase } from "@/shared/config/supabase"
import type { UpdatePasswordPayload } from "../types/settings.types"

export function useUpdatePasswordMutation() {
  return useMutation<void, Error, UpdatePasswordPayload>({
    mutationFn: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success("Password updated successfully.")
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update password. Please try again.")
    },
  })
}
