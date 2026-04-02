// @module: shared
// @layer: constants
// @scope: global
// @deps: none

export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT: "/forgot",
    RESET: "/reset",
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
  },
  WORKSPACES: {
    INDEX: "/workspaces",
    EDITOR: "/workspaces/editor",
  },
} as const
