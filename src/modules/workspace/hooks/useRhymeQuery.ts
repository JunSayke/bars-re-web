import { useQuery } from "@tanstack/react-query"
import { findRhymes } from "../services/thesaurus.service"
import { thesaurusKeys } from "./queryKeys"

export function useRhymeQuery(term: string, page = 1) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: thesaurusKeys.rhyme(term, page),
    queryFn: () => findRhymes(term, page),
    enabled: !!term,
  })
  return { result: data ?? null, isLoading, isError, refetch }
}
