import { setupWorker } from "msw/browser"
import { authHandlers } from "@/modules/auth/mocks/auth.handlers"
import { workspaceHandlers } from "@/modules/workspace/mocks/workspace.handlers"
import { snippetHandlers } from "@/modules/workspace/mocks/snippet.handlers"

export const worker = setupWorker(...authHandlers, ...workspaceHandlers, ...snippetHandlers)
