import { useMutation, useQueryClient } from "@tanstack/react-query"
import { upsertBeatLink } from "../services/beat-link.service"
import { workspaceKeys } from "./queryKeys"
import type { BeatLink } from "../schemas/workspace.schema"

interface UpsertBeatLinkVars {
  sessionId: string
  url: string
}

export function useUpsertBeatLinkMutation() {
  const queryClient = useQueryClient()

  return useMutation<BeatLink, Error, UpsertBeatLinkVars>({
    mutationFn: ({ sessionId, url }) => upsertBeatLink(sessionId, url),
    onSuccess: (_, { sessionId }) => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLink(sessionId) })
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLibrary() })
    },
  })
}
