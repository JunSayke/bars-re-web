import { useQuery } from "@tanstack/react-query"
import { findSynonyms } from "../services/thesaurus.service"
import { thesaurusKeys } from "./queryKeys"

export function useSynonymQuery(term: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: thesaurusKeys.synonyms(term),
    queryFn: () => findSynonyms(term),
    enabled: !!term,
  })
  return { result: data ?? null, isLoading, isError, refetch }
}
