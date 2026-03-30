import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateSnippet } from "../services/snippet.service"
import { snippetKeys } from "./queryKeys"
import type { UpdateSnippetPayload } from "../types/snippet.types"

export function useUpdateSnippetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSnippetPayload }) =>
      updateSnippet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.snippets() })
    },
  })
}
