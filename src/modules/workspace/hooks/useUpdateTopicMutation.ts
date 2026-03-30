import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateSessionTopic } from "../services/session.service"
import { workspaceKeys } from "./queryKeys"
import { toast } from "sonner"

export function useUpdateTopicMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, topic }: { id: string; topic: string }) =>
      updateSessionTopic(id, topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.sessions() })
    },
    onError: () => {
      toast.error("Failed to update topic. Please try again.")
    },
  })
}
