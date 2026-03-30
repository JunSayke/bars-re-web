## 1. Foundation & UI Shell

- [x] 1.1 Create `AiAssistantPanel.tsx` in `src/modules/workspace/components/templates/` to act as the draggable, resizable floating shell (mirroring pointer-event logic from `SnippetsPanel`).
- [x] 1.2 Update `PANEL_OPTIONS` in the workspace window menu to include the `"ai-assistant"` toggle.
- [x] 1.3 Update `EditorPage.tsx` in `src/modules/workspace/components/` to read the `"ai-assistant"` open panel state and render `<AiAssistantPanel>`.

## 2. Feedback View & Logic

- [x] 2.1 Create `AiFeedbackView.tsx` in `src/modules/workspace/components/organisms/` with local state for the lyrics input and the feedback payload.
- [x] 2.2 Implement the "Input State" in `AiFeedbackView` (a textarea with a word/character counter and an "Analyze Lyrics" button).
- [x] 2.3 Implement the "Loading State" and wiring: use `useTransition` to call the `getLyricsFeedback` Server Action when the button is clicked.
- [x] 2.4 Implement the "Results State" in `AiFeedbackView` to parse and render the returned JSON (Score, Flow Issues with line references, General Suggestions).

## 3. Integration & Polish

- [x] 3.1 Mount `<AiFeedbackView>` inside `<AiAssistantPanel>`.
- [x] 3.2 Add a "Reset / Analyze Another Verse" button in the results view to clear the state and return to the input textarea.
