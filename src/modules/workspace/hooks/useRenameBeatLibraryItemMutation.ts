import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renameBeatFile, renameBeatLink } from "../services/beat-metadata.service"
import { workspaceKeys } from "./queryKeys"

interface RenameBeatLibraryItemVars {
  kind: "file" | "link"
  recordId: string
  sessionId: string
  beatName: string
}

export function useRenameBeatLibraryItemMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, RenameBeatLibraryItemVars>({
    mutationFn: async ({ kind, recordId, beatName }) => {
      if (kind === "file") {
        await renameBeatFile(recordId, beatName)
      } else {
        await renameBeatLink(recordId, beatName)
      }
    },
    onSuccess: async (_, vars) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLibrary() }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.session(vars.sessionId) }),
        queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLink(vars.sessionId) }),
      ])
    },
  })
}
