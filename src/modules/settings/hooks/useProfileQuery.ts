"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile } from "../services/profile.service"
import { settingsKeys } from "./queryKeys"
import type { Profile } from "../types/settings.types"

export function useProfileQuery() {
  const { data, isLoading, isError } = useQuery<Profile>({
    queryKey: settingsKeys.profile(),
    queryFn: getProfile,
  })

  return { profile: data ?? null, isLoading, isError }
}
