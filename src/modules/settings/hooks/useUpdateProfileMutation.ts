"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateProfile } from "../services/profile.service"
import { settingsKeys } from "./queryKeys"
import type { Profile, UpdateProfilePayload } from "../types/settings.types"

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation<Profile, Error, UpdateProfilePayload>({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.profile() })
      toast.success("Profile updated")
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.")
    },
  })
}
