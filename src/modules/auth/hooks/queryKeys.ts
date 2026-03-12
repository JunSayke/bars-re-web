export const authKeys = {
  all: ["auth"] as const,
  login: () => [...authKeys.all, "login"] as const,
  signup: () => [...authKeys.all, "signup"] as const,
}
