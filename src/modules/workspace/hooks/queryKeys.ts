export const workspaceKeys = {
  all: ["workspace"] as const,
  session: (id: string) => [...workspaceKeys.all, "session", id] as const,
  draft: (id: string) => [...workspaceKeys.all, "draft", id] as const,
}
