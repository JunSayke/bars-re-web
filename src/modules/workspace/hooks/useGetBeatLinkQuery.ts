import { useQuery } from "@tanstack/react-query"
import { getBeatLink } from "../services/beat-link.service"
import { workspaceKeys } from "./queryKeys"
import type { BeatLink } from "../schemas/workspace.schema"

export function useGetBeatLinkQuery(sessionId: string) {
  const { data, isLoading, isError } = useQuery<BeatLink | null>({
    queryKey: workspaceKeys.beatLink(sessionId),
    queryFn: () => getBeatLink(sessionId),
    enabled: !!sessionId,
  })
  return { beatLink: data ?? null, isLoading, isError }
}
