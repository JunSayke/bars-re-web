import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteBeatLibraryItem } from "../services/beat-library.service"
import type { BeatLibraryItem } from "../services/beat-library.service"
import { workspaceKeys } from "./queryKeys"

export function useDeleteBeatLibraryItemMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, BeatLibraryItem>({
    mutationFn: deleteBeatLibraryItem,
    onSuccess: (_, item) => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLibrary() })
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.session(item.sessionId) })
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.beatLink(item.sessionId) })
    },
  })
}
