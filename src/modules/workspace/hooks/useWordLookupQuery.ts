import { useQuery } from "@tanstack/react-query"
import { lookupWord } from "../services/thesaurus.service"
import { thesaurusKeys } from "./queryKeys"

export function useWordLookupQuery(term: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: thesaurusKeys.lookup(term),
    queryFn: () => lookupWord(term),
    enabled: !!term,
  })
  return { result: data ?? null, isLoading, isError }
}
