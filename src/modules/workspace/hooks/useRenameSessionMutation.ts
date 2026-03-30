import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renameSession } from "../services/session.service"
import { workspaceKeys } from "./queryKeys"
import { toast } from "sonner"

export function useRenameSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameSession(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.sessions() })
    },
    onError: () => {
      toast.error("Failed to rename session. Please try again.")
    },
  })
}
