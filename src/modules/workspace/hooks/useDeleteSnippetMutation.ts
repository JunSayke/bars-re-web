import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteSnippet } from "../services/snippet.service"
import { snippetKeys } from "./queryKeys"
import type { Snippet } from "../types/snippet.types"

export function useDeleteSnippetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSnippet(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: snippetKeys.snippets() })
      const previous = queryClient.getQueryData<Snippet[]>(snippetKeys.snippets())
      queryClient.setQueryData<Snippet[]>(snippetKeys.snippets(), (old) =>
        old ? old.filter((s) => s.id !== id) : []
      )
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(snippetKeys.snippets(), ctx.previous)
      }
      toast.error("Failed to delete snippet. Please try again.")
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: snippetKeys.snippets() })
    },
  })
}
