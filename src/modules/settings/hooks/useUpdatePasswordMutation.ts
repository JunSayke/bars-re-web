"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { supabase } from "@/shared/config/supabase"
import type { UpdatePasswordPayload } from "../types/settings.types"

export function useUpdatePasswordMutation() {
  return useMutation<void, Error, UpdatePasswordPayload>({
    mutationFn: async ({ currentPassword, newPassword }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error("Could not verify your identity. Please log in again.")

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (signInError) throw new Error("Current password is incorrect.")

      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw new Error(error.message)

      await supabase.auth.signOut()
    },
    onSuccess: () => {
      toast.success("Password updated. Please log in with your new password.")
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update password. Please try again.")
    },
  })
}
