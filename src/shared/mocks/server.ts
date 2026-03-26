import { setupServer } from "msw/node"
import { authHandlers } from "@/modules/auth/mocks/auth.handlers"
import { workspaceHandlers } from "@/modules/workspace/mocks/workspace.handlers"

export const server = setupServer(...authHandlers, ...workspaceHandlers)
