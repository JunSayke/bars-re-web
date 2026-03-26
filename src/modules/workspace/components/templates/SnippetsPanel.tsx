"use client"

import { useRef, useState, type ReactNode } from "react"

const INITIAL_WIDTH = 380
const INITIAL_HEIGHT = 520
const MIN_WIDTH = 300
const MIN_HEIGHT = 400

function getInitialPos(w: number, h: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  return {
    x: Math.max(0, window.innerWidth - 320 - w),
    y: Math.max(0, window.innerHeight - 80 - h),
  }
}

interface SnippetsPanelProps {
  onClose: () => void
  children: ReactNode
}

export function SnippetsPanel({ onClose, children }: SnippetsPanelProps) {
  const [pos, setPos] = useState(() => getInitialPos(INITIAL_WIDTH, INITIAL_HEIGHT))
  const [panelSize, setPanelSize] = useState({ w: INITIAL_WIDTH, h: INITIAL_HEIGHT })

  const dragState = useRef<{
    startX: number
    startY: number
    originX: number
    originY: number
  } | null>(null)

  const resizeState = useRef<{
    startX: number
    startY: number
    originW: number
    originH: number
  } | null>(null)

  function onPanelPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    }
  }

  function onPanelPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return
    setPos({
      x: dragState.current.originX + (e.clientX - dragState.current.startX),
      y: dragState.current.originY + (e.clientY - dragState.current.startY),
    })
  }

  function onPanelPointerUp() {
    if (!dragState.current) return
    dragState.current = null
    setPos((p) => ({
      x: Math.max(0, Math.min(window.innerWidth - panelSize.w, p.x)),
      y: Math.max(0, Math.min(window.innerHeight - panelSize.h, p.y)),
    }))
  }

  function onResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originW: panelSize.w,
      originH: panelSize.h,
    }
  }

  function onResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!resizeState.current) return
    setPanelSize({
      w: Math.max(MIN_WIDTH, resizeState.current.originW + (e.clientX - resizeState.current.startX)),
      h: Math.max(MIN_HEIGHT, resizeState.current.originH + (e.clientY - resizeState.current.startY)),
    })
  }

  function onResizePointerUp() {
    resizeState.current = null
  }

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: panelSize.w,
    height: panelSize.h,
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    zIndex: 50,
  }

  return (
    <div
      style={panelStyle}
      className="flex flex-col rounded-lg border border-border bg-card shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDown={onPanelPointerDown}
      onPointerMove={onPanelPointerMove}
      onPointerUp={onPanelPointerUp}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-secondary select-none flex-shrink-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
          Verse Snippets
        </span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-sm leading-none cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
      </div>

      <div
        className="flex-1 overflow-hidden p-3 cursor-default"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        style={{ touchAction: "none" }}
      />
    </div>
  )
}
