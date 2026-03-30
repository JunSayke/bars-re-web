# bars-editor-zoom Specification

## Purpose
TBD - introduced by change workspace-editor-responsive-zoom. Implement zoom controls (state, persistence, and `BarsEditor` scaling).

## Requirements
### Requirement: Zoom level state with localStorage persistence
`EditorPage` SHALL maintain a `zoomLevel` integer state (range 50–200, step 10, default 100). On mount it SHALL read the persisted value from `localStorage` key `bars:editorZoom` (in a `useEffect` to avoid SSR hydration mismatch). On every change it SHALL write the updated value to `localStorage`.

#### Scenario: Default zoom on first visit
- **WHEN** the user opens the editor for the first time (no `bars:editorZoom` key in localStorage)
- **THEN** the zoom level SHALL default to 100 %

#### Scenario: Zoom preference persists across page refreshes
- **WHEN** the user sets the zoom to 130 % and refreshes the page
- **THEN** the editor SHALL load with the zoom level set to 130 %

#### Scenario: Zoom level is clamped to valid range
- **WHEN** a localStorage value outside 50–200 is read on mount
- **THEN** the state SHALL be clamped to the nearest valid boundary (50 or 200)

---

### Requirement: Zoom controls in EditorTopNav
`EditorTopNav` SHALL render a `−` decrement button, a `{zoomLevel}%` label, and a `+` increment button adjacent to the settings button. These SHALL accept three props: `zoomLevel: number`, `onZoomIn: () => void`, `onZoomOut: () => void`.

The `−` button SHALL be disabled when `zoomLevel <= 50`.
The `+` button SHALL be disabled when `zoomLevel >= 200`.

Each press SHALL change `zoomLevel` by ±10.

#### Scenario: Zoom in increments zoom level
- **WHEN** the user clicks the `+` button and current zoom is < 200
- **THEN** the zoom level SHALL increase by 10 and the label SHALL update immediately

#### Scenario: Zoom out decrements zoom level
- **WHEN** the user clicks the `−` button and current zoom is > 50
- **THEN** the zoom level SHALL decrease by 10 and the label SHALL update immediately

#### Scenario: Zoom in button disabled at maximum
- **WHEN** the zoom level is 200
- **THEN** the `+` button SHALL be disabled and pressing it SHALL have no effect

#### Scenario: Zoom out button disabled at minimum
- **WHEN** the zoom level is 50
- **THEN** the `−` button SHALL be disabled and pressing it SHALL have no effect

---

### Requirement: BarsEditor scales with zoom level
`BarsEditor` SHALL accept a `zoomScale: number` prop (the fraction `zoomLevel / 100`). Its root `<div>` SHALL apply an inline `fontSize` style of `${zoomScale}rem` so all descendant `text-*` classes scale relative to this new root em context.

Only `BarsEditor` and its children SHALL be affected. `BeatPlayerBar`, `EditorTopNav`, `SnippetsPanel`, `ThesaurusPanel`, and `AiAssistantPanel` SHALL remain at their original sizes.

#### Scenario: BarsEditor text scales at 130%
- **WHEN** the user sets zoom to 130
- **THEN** the bar input text, line numbers, section labels, and word count indicator inside `BarsEditor` SHALL all render proportionally larger

#### Scenario: Adjacent organisms unaffected by zoom
- **WHEN** the user changes the zoom level
- **THEN** `EditorTopNav`, `BeatPlayerBar`, and side panels SHALL render at their original sizes, unaffected by the `zoomScale` prop
