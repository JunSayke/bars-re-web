import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createSession } from "../services/workspace.service"
import { workspaceKeys } from "./queryKeys"
import type { CreateSessionPayload } from "../schemas/workspace.schema"

export function useCreateSessionMutation() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => createSession(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.sessions() })
      router.push(`/workspaces/editor?id=${data.id}`)
    },
    onError: (err) => {
      const message =
        (err as { message?: string })?.message === "Session limit reached"
          ? "Session limit reached. Delete an existing session to continue."
          : "Failed to create session. Please try again."
      toast.error(message)
    },
  })
}
