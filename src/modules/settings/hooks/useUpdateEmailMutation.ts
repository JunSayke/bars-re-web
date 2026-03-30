"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { supabase } from "@/shared/config/supabase"
import type { UpdateEmailPayload } from "../types/settings.types"

export function useUpdateEmailMutation() {
  return useMutation<void, Error, UpdateEmailPayload>({
    mutationFn: async ({ newEmail }) => {
      const { error } = await supabase.auth.updateUser({ email: newEmail })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => {
      toast.success("A confirmation link has been sent to your new email.")
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update email. Please try again.")
    },
  })
}
