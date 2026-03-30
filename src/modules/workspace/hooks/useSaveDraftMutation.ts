"use client"

import { useMutation } from "@tanstack/react-query"
import { saveDraft } from "../services/editor.service"
import type { SaveDraftPayload, SaveResult } from "../schemas/workspace.schema"

export function useSaveDraftMutation(sessionId: string) {
  const { mutate, isPending, isError, isSuccess } = useMutation<
    SaveResult,
    Error,
    SaveDraftPayload
  >({
    mutationFn: (payload) => saveDraft(sessionId, payload),
  })

  return { mutate, isPending, isError, isSuccess }
}
