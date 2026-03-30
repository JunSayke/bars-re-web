import { setupServer } from "msw/node"
import { authHandlers } from "@/modules/auth/mocks/auth.handlers"
import { workspaceHandlers } from "@/modules/workspace/mocks/workspace.handlers"
import { snippetHandlers } from "@/modules/workspace/mocks/snippet.handlers"
import { thesaurusHandlers } from "@/modules/workspace/mocks/thesaurus.handlers"
import { beatLinkHandlers } from "@/modules/workspace/mocks/beat-link.handlers"

export const server = setupServer(...authHandlers, ...workspaceHandlers, ...snippetHandlers, ...thesaurusHandlers, ...beatLinkHandlers)
