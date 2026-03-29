## Why

Writers need immediate, targeted AI feedback on specific bars they are struggling with, without losing their place in the editor or spending tokens to analyze the entire track. A floating, draggable assistant provides an in-context "co-writer" experience right where the typing happens.

## What Changes

- Add an "AI Assistant" toggle to the workspace bottom-right panel options.
- Introduce a new draggable, resizable floating panel for the AI Assistant.
- Implement an input state allowing users to type/paste specific lyrics to be analyzed (with character/word limits).
- Implement a results state that renders the structured feedback (Score, Flow Issues, General Suggestions) from the existing AI backend.
- Wire the UI to the existing `getLyricsFeedback` Server Action.

## Capabilities

### New Capabilities
- `workspace-ai-assistant`: The floating, draggable UI panel, input form, and structured feedback display within the editor canvas.

### Modified Capabilities
- `workspace-editor`: Updates to panel management and the workspace window menu to support toggling the new AI assistant.

## Impact

- **UI Components:** Creates new `AiAssistantPanel` (template) and `AiFeedbackView` (organism) in the workspace module.
- **Editor State:** Updates `EditorPage.tsx` and `PANEL_OPTIONS` to track the visibility of the new panel.
- **Backend:** None. Relies entirely on the existing `getLyricsFeedback` Server Action and `aiFeedbackSchema`.
