import { useQuery } from "@tanstack/react-query"
import { getSnippets } from "../services/snippet.service"
import { snippetKeys } from "./queryKeys"

export function useSnippetsQuery() {
  const { data, isLoading, isError } = useQuery({
    queryKey: snippetKeys.snippets(),
    queryFn: getSnippets,
  })
  return { snippets: data ?? [], isLoading, isError }
}
