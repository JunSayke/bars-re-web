import { useQuery } from "@tanstack/react-query"
import { getRecentBeatLibrary } from "../services/beat-library.service"
import { workspaceKeys } from "./queryKeys"

export function useBeatLibraryQuery(limit = 20) {
  const { data, isLoading, isError } = useQuery({
    queryKey: workspaceKeys.beatLibraryRecent(limit),
    queryFn: () => getRecentBeatLibrary(limit),
  })

  return {
    beats: data ?? [],
    isLoading,
    isError,
  }
}
