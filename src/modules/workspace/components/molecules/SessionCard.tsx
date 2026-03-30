"use client"

import { useState } from "react"
import type { MouseEvent } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SessionThumbnail } from "../atoms/SessionThumbnail"
import { TopicBadge } from "../atoms/TopicBadge"
import { SessionOverflowMenu } from "./SessionOverflowMenu"
import type { SessionSummary } from "../../schemas/workspace.schema"

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

interface SessionCardProps {
  session: SessionSummary
  onOpen: () => void
  onRename: () => void
  onEditTopic: () => void
  onDelete: () => void
}

export function SessionCard({ session, onOpen, onRename, onEditTopic, onDelete }: SessionCardProps) {
  const [isTopicExpanded, setIsTopicExpanded] = useState(false)

  function handleTopicToggle(e: MouseEvent) {
    e.stopPropagation()
    setIsTopicExpanded((prev) => !prev)
  }

  return (
    <div className="group flex items-center gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent/40">
      {/* Clickable area */}
      <button
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={onOpen}
        type="button"
      >
        <SessionThumbnail thumbnailType={session.thumbnailType} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{session.title}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{session.previewSnippet}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <TopicBadge
              topic={session.topic}
              expanded={isTopicExpanded}
              onToggle={handleTopicToggle}
            />
            <span className="text-xs text-muted-foreground">{relativeTime(session.lastModifiedAt)}</span>
          </div>
        </div>
      </button>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {/* TODO: wire up beat playback in transaction 4.4 */}
        <Button variant="ghost" size="icon-sm" disabled title="Play beat (coming soon)">
          <Play className="size-4" />
          <span className="sr-only">Play beat</span>
        </Button>
        <SessionOverflowMenu onRename={onRename} onEditTopic={onEditTopic} onDelete={onDelete} />
      </div>
    </div>
  )
}
