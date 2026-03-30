"use client"

import { useQuery } from "@tanstack/react-query"
import { workspaceKeys } from "./queryKeys"
import { getSession } from "../services/editor.service"
import type { WritingSession } from "../schemas/workspace.schema"

export function useGetSessionQuery(sessionId: string) {
  const { data, isLoading, isError } = useQuery<WritingSession>({
    queryKey: workspaceKeys.session(sessionId),
    queryFn: () => getSession(sessionId),
    enabled: Boolean(sessionId),
  })

  return { session: data, isLoading, isError }
}
