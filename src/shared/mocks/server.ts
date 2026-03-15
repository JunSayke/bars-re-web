import { setupServer } from "msw/node"
import { authHandlers } from "@/modules/auth/mocks/auth.handlers"

export const server = setupServer(...authHandlers)
