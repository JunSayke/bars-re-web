import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createSnippet } from "../services/snippet.service"
import { snippetKeys } from "./queryKeys"

export function useCreateSnippetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.snippets() })
    },
  })
}
