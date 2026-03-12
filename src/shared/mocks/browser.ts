import { setupWorker } from "msw/browser"
import { authHandlers } from "@/modules/auth/mocks/auth.handlers"

export const worker = setupWorker(...authHandlers)
