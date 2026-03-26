import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renameSession } from "../services/workspace.service"
import { workspaceKeys } from "./queryKeys"

export function useRenameSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameSession(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.sessions() })
    },
  })
}
