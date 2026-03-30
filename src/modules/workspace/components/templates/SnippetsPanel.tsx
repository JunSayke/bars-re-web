"use client"

import { useRef, useState, type ReactNode } from "react"

const INITIAL_WIDTH = 380
const INITIAL_HEIGHT = 520
const MIN_WIDTH = 300
const MIN_HEIGHT = 400

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

function getInitialPos(w: number, h: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  return {
    x: Math.max(0, window.innerWidth - 320 - w),
    y: Math.max(0, window.innerHeight - 80 - h),
  }
}

interface SnippetsPanelProps {
  onClose: () => void
  onActivate: () => void
  zIndex: number
  children: ReactNode
}

export function SnippetsPanel({ onClose, onActivate, zIndex, children }: SnippetsPanelProps) {
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
    originX: number
    originY: number
    dir: ResizeDir
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

  function onResizePointerDown(e: React.PointerEvent<HTMLDivElement>, dir: ResizeDir) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
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
    zIndex,
  }

  return (
    <div
      style={panelStyle}
      className="flex flex-col rounded-lg border border-border bg-card shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
      onPointerDownCapture={() => onActivate()}
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

      {/* Top edge */}
      <div className="absolute top-0 left-4 right-4 h-1 cursor-n-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "n")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* Bottom edge */}
      <div className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "s")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* Left edge */}
      <div className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "w")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* Right edge */}
      <div className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "e")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* NW corner */}
      <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "nw")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* NE corner */}
      <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "ne")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* SW corner */}
      <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "sw")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
      {/* SE corner */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10" onPointerDown={(e) => onResizePointerDown(e, "se")} onPointerMove={onResizePointerMove} onPointerUp={onResizePointerUp} style={{ touchAction: "none" }} />
    </div>
  )
}
