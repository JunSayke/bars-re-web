"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SessionCard } from "../molecules/SessionCard"
import { RenameSessionDialog } from "../molecules/RenameSessionDialog"
import { DeleteSessionDialog } from "../molecules/DeleteSessionDialog"
import { useSessionsQuery } from "../../hooks/useSessionsQuery"
import { useRenameSessionMutation } from "../../hooks/useRenameSessionMutation"
import { useDeleteSessionMutation } from "../../hooks/useDeleteSessionMutation"
import type { SessionSummary } from "../../schemas/workspace.schema"

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">You have no saved sessions.</p>
      <p className="mt-1 text-xs text-muted-foreground">Click 'New Session' to start writing.</p>
    </div>
  )
}

export function SessionsList() {
  const router = useRouter()
  const { data: sessions = [], isLoading } = useSessionsQuery()
  const renameMutation = useRenameSessionMutation()
  const deleteMutation = useDeleteSessionMutation()

  const [renameTarget, setRenameTarget] = useState<SessionSummary | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SessionSummary | null>(null)

  function handleRenameConfirm(newTitle: string) {
    if (!renameTarget) return
    renameMutation.mutate({ id: renameTarget.id, title: newTitle }, { onSettled: () => setRenameTarget(null) })
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, { onSettled: () => setDeleteTarget(null) })
  }

  if (isLoading) {
    return <div className="text-xs text-muted-foreground">Loading sessions…</div>
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {sessions.length === 0 ? (
          <EmptyState />
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onOpen={() => router.push(`/workspaces/editor?id=${session.id}`)}
              onRename={() => setRenameTarget(session)}
              onDelete={() => setDeleteTarget(session)}
            />
          ))
        )}
      </div>

      <RenameSessionDialog
        key={renameTarget?.id ?? ""}
        open={renameTarget !== null}
        initialTitle={renameTarget?.title ?? ""}
        onClose={() => setRenameTarget(null)}
        onConfirm={handleRenameConfirm}
      />

      <DeleteSessionDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
