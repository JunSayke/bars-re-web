"use client"

import { useRef, useState } from "react"
import { useGetBeatLinkQuery } from "../../hooks/useGetBeatLinkQuery"
import { useUpsertBeatLinkMutation } from "../../hooks/useUpsertBeatLinkMutation"
import { BeatLinkForm } from "../molecules/BeatLinkForm"
import { SpotifyEmbedPlayer } from "../molecules/SpotifyEmbedPlayer"
import { YouTubeEmbedPlayer } from "../molecules/YouTubeEmbedPlayer"
import { SoundCloudEmbedPlayer } from "../molecules/SoundCloudEmbedPlayer"
import type { BeatLink } from "../../schemas/workspace.schema"
import { usePanelDrag } from "../../lib/usePanelDrag"

const INITIAL_WIDTH = 420
const INITIAL_HEIGHT = 340
const MIN_WIDTH = 320
const MIN_HEIGHT = 240

function getInitialPos(w: number, h: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  return {
    x: Math.max(0, window.innerWidth - w - 24),
    y: Math.max(0, window.innerHeight - h - 100),
  }
}

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

interface BeatLinkPanelProps {
  sessionId: string
  onClose: () => void
  onActivate: () => void
  zIndex: number
}

function renderEmbedPlayer(beatLink: BeatLink) {
  switch (beatLink.provider) {
    case "youtube":
      return <YouTubeEmbedPlayer url={beatLink.url} />
    case "soundcloud":
      return <SoundCloudEmbedPlayer url={beatLink.url} />
    default:
      return <SpotifyEmbedPlayer url={beatLink.url} />
  }
}

export function BeatLinkPanel({ sessionId, onClose, onActivate, zIndex }: BeatLinkPanelProps) {
  const { beatLink, isLoading } = useGetBeatLinkQuery(sessionId)
  const upsertMutation = useUpsertBeatLinkMutation()
  const [replacing, setReplacing] = useState(false)

  const showForm = !beatLink || replacing

  const [pos, setPos] = useState(() => getInitialPos(INITIAL_WIDTH, INITIAL_HEIGHT))
  const [panelSize, setPanelSize] = useState({ w: INITIAL_WIDTH, h: INITIAL_HEIGHT })

  const resizeState = useRef<{
    startX: number
    startY: number
    originW: number
    originH: number
    originX: number
    originY: number
    dir: ResizeDir
  } | null>(null)

  const dragHandlers = usePanelDrag(pos, panelSize, setPos)

  function onResizePointerDown(e: React.PointerEvent<HTMLDivElement>, dir: ResizeDir) {
    e.stopPropagation()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {
      // ignore - some browsers may not support pointer capture in this context
    }
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originW: panelSize.w,
      originH: panelSize.h,
      originX: pos.x,
      originY: pos.y,
      dir,
    }
  }

  function onResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeState.current) return
    const { startX, startY, originW, originH, originX, originY, dir } = resizeState.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    let newW = originW
    let newH = originH
    let newX = originX
    let newY = originY
    if (dir.includes("e")) newW = Math.max(MIN_WIDTH, originW + dx)
    if (dir.includes("w")) {
      newW = Math.max(MIN_WIDTH, originW - dx)
      newX = originX + (originW - newW)
    }
    if (dir.includes("s")) newH = Math.max(MIN_HEIGHT, originH + dy)
    if (dir.includes("n")) {
      newH = Math.max(MIN_HEIGHT, originH - dy)
      newY = originY + (originH - newH)
    }
    setPanelSize({ w: newW, h: newH })
    setPos({ x: newX, y: newY })
  }

  function onResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
    resizeState.current = null
  }

  function onResizePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    // mirror pointer up behavior on cancel
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
    resizeState.current = null
  }

  function handleSubmit(url: string) {
    upsertMutation.mutate(
      { sessionId, url },
      { onSuccess: () => setReplacing(false) }
    )
  }

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: panelSize.w,
    height: panelSize.h,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    zIndex,
  }

  return (
    <div style={panelStyle} onPointerDownCapture={onActivate} className="flex flex-col rounded-lg border border-border bg-card shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-secondary select-none flex-shrink-0">
        <div
          className="mr-2 w-6 h-6 cursor-grab active:cursor-grabbing flex items-center justify-center"
          role="button"
          tabIndex={0}
          aria-label="Move panel"
          {...dragHandlers}
          style={{ touchAction: "none" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M10 6h2v2h-2zM6 6h2v2H6zM14 6h2v2h-2zM18 6h2v2h-2zM10 10h2v2h-2zM6 10h2v2H6z" fill="currentColor" />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Beat Link</span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-sm leading-none cursor-pointer"
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div
        className="flex-1 overflow-hidden p-3 cursor-default flex flex-col gap-3"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="h-4 w-3/4 rounded bg-secondary/60 animate-pulse" />
        ) : showForm ? (
          <>
            {/* Instructional helper text (task 7.4) — shown only when no embed is active */}
            <div className="flex flex-col gap-1" style={{ fontFamily: "var(--font-sans)" }}>
              <p className="text-xs text-muted-foreground">
                Paste a Spotify, YouTube, or SoundCloud link to play it while you write.
              </p>
              <ol className="text-xs text-muted-foreground list-decimal list-inside space-y-0.5">
                <li>Open the track on Spotify, YouTube, or SoundCloud</li>
                <li>Copy the link</li>
                <li>Paste the link below</li>
              </ol>
            </div>
            <BeatLinkForm
              defaultUrl={beatLink?.url ?? ""}
              isPending={upsertMutation.isPending}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-hidden">
              {renderEmbedPlayer(beatLink)}
            </div>
            <button
              type="button"
              className="self-start text-xs font-medium px-3 py-1.5 rounded border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer flex-shrink-0"
              onClick={() => setReplacing(true)}
            >
              Replace
            </button>
          </>
        )}
      </div>

      {/* Resize handles – all 8 edges/corners */}
       {/* Top edge */}
    <div className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "n")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* Bottom edge */}
    <div className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "s")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* Left edge */}
    <div className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "w")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* Right edge */}
    <div className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "e")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* NW corner */}
    <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "nw")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* NE corner */}
    <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "ne")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* SW corner */}
    <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "sw")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
       {/* SE corner */}
    <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "se")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} onPointerCancel={onResizePointerCancel} style={{ touchAction: "none" }} />
    </div>
  )
}
