import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteSession } from "../services/workspace.service"
import { workspaceKeys } from "./queryKeys"
import type { SessionSummary } from "../schemas/workspace.schema"

export function useDeleteSessionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.sessions() })
      const previous = queryClient.getQueryData<SessionSummary[]>(workspaceKeys.sessions())
      queryClient.setQueryData<SessionSummary[]>(workspaceKeys.sessions(), (old) =>
        old ? old.filter((s) => s.id !== id) : []
      )
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(workspaceKeys.sessions(), ctx.previous)
      }
      toast.error("Failed to delete session. Please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.sessions() })
    },
  })
}
