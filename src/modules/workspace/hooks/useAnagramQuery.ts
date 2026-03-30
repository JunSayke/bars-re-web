import { useQuery } from "@tanstack/react-query"
import { findAnagrams } from "../services/thesaurus.service"
import { thesaurusKeys } from "./queryKeys"

export function useAnagramQuery(term: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: thesaurusKeys.anagrams(term),
    queryFn: () => findAnagrams(term),
    enabled: !!term,
  })
  return { result: data ?? null, isLoading, isError, refetch }
}
