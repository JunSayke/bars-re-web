import { useRef } from "react"

type Pos = { x: number; y: number }
type Size = { w: number; h: number }

export function usePanelDrag(pos: Pos, panelSize: Size, setPos: (p: Pos | ((cur: Pos) => Pos)) => void) {
  const dragState = useRef<null | { startX: number; startY: number; originX: number; originY: number }>(null)

  function onHandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    // Only allow primary button
    if (e.button !== 0) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    }
  }

  function onHandlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return
    const { startX, startY, originX, originY } = dragState.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    const nextX = Math.max(0, Math.min(window.innerWidth - panelSize.w, originX + dx))
    const nextY = Math.max(0, Math.min(window.innerHeight - panelSize.h, originY + dy))
    setPos({ x: nextX, y: nextY })
  }

  function onHandlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
    dragState.current = null
  }

  function onHandlePointerCancel(e: React.PointerEvent<HTMLDivElement>) {
    // Mirror pointer up behavior on cancel to ensure we release capture and clear state
    if (!dragState.current) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch (err) {
      // ignore
    }
    dragState.current = null
  }

  return {
    onPointerDown: onHandlePointerDown,
    onPointerMove: onHandlePointerMove,
    onPointerUp: onHandlePointerUp,
    onPointerCancel: onHandlePointerCancel,
  }
}
