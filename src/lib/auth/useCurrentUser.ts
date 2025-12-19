"use client";
import { useQuery } from "react-query";

type CurrentUser = { id?: string; name?: string; email?: string; avatar?: string } | null;

export function useCurrentUser() {
  return useQuery<CurrentUser>(
    ["currentUser"],
    async () => {
      try {
        const res = await fetch("/api/users/me", { credentials: "include" });
        if (!res.ok) return null;
        const body = await res.json();
        // Body shape may vary; try common fields
        return { id: body?.id, name: body?.name || body?.username || body?.displayName, email: body?.email, avatar: body?.avatarUrl ?? body?.avatar } as CurrentUser;
      } catch (e) {
        return null;
      }
    },
    { staleTime: 60_000, retry: false }
  );
}
