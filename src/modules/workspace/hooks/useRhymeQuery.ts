import { useQuery } from "@tanstack/react-query"
import { findRhymes } from "../services/thesaurus.service"
import { thesaurusKeys } from "./queryKeys"

export function useRhymeQuery(term: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: thesaurusKeys.rhyme(term),
    queryFn: () => findRhymes(term),
    enabled: !!term,
  })
  return { result: data ?? null, isLoading, isError, refetch }
}
