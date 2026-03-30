"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadBeat } from "../services/beat.service"
import { workspaceKeys } from "./queryKeys"
import type { Beat } from "../schemas/workspace.schema"

export function useImportBeatMutation(sessionId: string) {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError, error } = useMutation<Beat, Error, File>({
    mutationFn: (file: File) => uploadBeat(sessionId, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.session(sessionId) })
    },
  })

  return { mutate, isPending, isError, error }
}
