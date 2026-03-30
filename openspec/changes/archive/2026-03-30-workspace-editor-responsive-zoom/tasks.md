## 1. EditorShell — Responsive Column Layout

- [x] 1.1 In `src/modules/workspace/components/templates/EditorShell.tsx`, replace the static `max-w-2xl px-6` classes on the inner `<div>` with `max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl px-4 sm:px-6 lg:px-10`
- [x] 1.2 Verify visually that the column expands correctly at md, lg, and xl breakpoints by resizing the browser window

## 2. EditorPage — Zoom State and localStorage Persistence

- [x] 2.1 Add a `zoomLevel` state (`useState<number>(100)`) to `EditorPage`
- [x] 2.2 Add a `useEffect` (runs once on mount) that reads `localStorage.getItem('bars:editorZoom')`, parses it to an integer, clamps it to ≥ 50 and ≤ 200, and calls `setZoomLevel` if a valid value is found
- [x] 2.3 Add a second `useEffect` (depends on `zoomLevel`) that writes `localStorage.setItem('bars:editorZoom', String(zoomLevel))`
- [x] 2.4 Derive `zoomScale = zoomLevel / 100` from the state
- [x] 2.5 Add `handleZoomIn` (sets `zoomLevel` to `Math.min(zoomLevel + 10, 200)`) and `handleZoomOut` (sets `zoomLevel` to `Math.max(zoomLevel - 10, 50)`) callbacks

## 3. EditorTopNav — Zoom Controls UI

- [x] 3.1 Add three new props to `EditorTopNavProps`: `zoomLevel: number`, `onZoomIn: () => void`, `onZoomOut: () => void`
- [x] 3.2 Inside the existing `<div className="flex items-center gap-2 shrink-0">`, add (before the settings button): a `−` button (disabled when `zoomLevel <= 50`), a `<span>{zoomLevel}%</span>` label, and a `+` button (disabled when `zoomLevel >= 200`)
- [x] 3.3 Style the zoom buttons consistently with the existing settings button (same `w-8 h-8` pattern), and make the label `text-xs text-muted-foreground w-10 text-center`

## 4. BarsEditor — Accept and Apply zoomScale Prop

- [x] 4.1 Add `zoomScale?: number` (default `1`) to `BarsEditorProps`
- [x] 4.2 Apply `style={{ fontSize: \`\${zoomScale}rem\` }}` to `BarsEditor`'s root `<div className="flex flex-col gap-6">` element

## 5. Wire EditorPage → EditorTopNav and BarsEditor

- [x] 5.1 Pass `zoomLevel`, `onZoomIn={handleZoomIn}`, `onZoomOut={handleZoomOut}` to the `<EditorTopNav>` usage in `EditorPage`
- [x] 5.2 Pass `zoomScale={zoomScale}` to the `<BarsEditor>` usage in `EditorPage`

## 6. Verification

- [x] 6.1 Open the editor, click `+` several times, confirm bar text and line numbers grow; verify nav and beat bar are unaffected
- [x] 6.2 Refresh the page and confirm the zoom level is restored from localStorage
- [x] 6.3 Confirm `+` is disabled at 200 % and `−` is disabled at 50 %
- [x] 6.4 Run `pnpm lint` and confirm no TypeScript errors introduced by new props
