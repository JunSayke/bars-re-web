import { useQuery } from "@tanstack/react-query"
import { getSessions } from "../services/session.service"
import { workspaceKeys } from "./queryKeys"

export function useSessionsQuery() {
  return useQuery({
    queryKey: workspaceKeys.sessions(),
    queryFn: getSessions,
  })
}
