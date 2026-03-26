"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SessionCountBar } from "./atoms/SessionCountBar"
import { SessionsList } from "./organisms/SessionsList"
import { NewSessionDialog } from "./molecules/NewSessionDialog"
import { useSessionsQuery } from "../hooks/useSessionsQuery"

export function WorkspacesPage() {
  const { data: sessions = [] } = useSessionsQuery()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sessions</h1>
        <Button onClick={() => setDialogOpen(true)}>New Session</Button>
      </div>
      <div className="mb-4">
        <SessionCountBar count={sessions.length} />
      </div>
      <SessionsList />
      <NewSessionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
