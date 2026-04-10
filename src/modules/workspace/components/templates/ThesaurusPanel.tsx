"use client"

import { useRef, useState } from "react"
import { usePanelDrag } from "../../lib/usePanelDrag"
import { ThesaurusTabs } from "../organisms/ThesaurusTabs"

const INITIAL_WIDTH = 520
const INITIAL_HEIGHT = 600
const MIN_WIDTH = 300
const MIN_HEIGHT = 400

function getInitialPos(w: number, h: number) {
  if (typeof window === "undefined") return { x: 0, y: 0 }
  return {
    x: Math.max(0, window.innerWidth - w - 24),
    y: 24,
  }
}

type ResizeDir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw"

interface ThesaurusPanelProps {
  onClose: () => void
  onActivate: () => void
  zIndex: number
}

export function ThesaurusPanel({ onClose, onActivate, zIndex }: ThesaurusPanelProps) {
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
      // ignore
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
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
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
        <span className="text-xs font-semibold uppercase tracking-widest text-foreground">Thesaurus Tools</span>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground text-sm leading-none cursor-pointer"
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
        <ThesaurusTabs />
      </div>

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
