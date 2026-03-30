## Context

The workspace currently lacks a way for writers to get immediate, in-context AI feedback on specific lines they are struggling with. While the backend supports lyrics analysis (`getLyricsFeedback` Server Action), exposing this directly in the editor canvas via a floating, draggable UI will significantly improve the writing workflow.

## Goals / Non-Goals

**Goals:**
- Provide a non-blocking, draggable UI panel inside the workspace editor.
- Allow users to input specific lyrics for targeted analysis.
- Reuse the existing `getLyricsFeedback` Server Action and `aiFeedbackSchema`.
- Integrate seamlessly with the existing `EditorPage` panel management (`PANEL_OPTIONS`).

**Non-Goals:**
- Real-time "linting" or squiggles directly inside the editor text (too complex for this iteration).
- Analyzing the entire `bars` state automatically by default (to save tokens and provide targeted feedback).
- Building new AI capabilities or modifying the backend schema.

## Decisions

**1. Component Architecture (Atomic Design)**
We will split the feature into two primary components within `src/modules/workspace`:
- `AiAssistantPanel.tsx` (Template): A pure UI shell responsible for draggability, positioning (x/y coordinates), and z-index management. It will mirror the math/hooks used in the existing `SnippetsPanel`.
- `AiFeedbackView.tsx` (Organism): The inner content that manages the input state (textarea), the loading state (`useTransition`), and the results state (rendering the JSON payload).
*Rationale:* Keeps the complex drag-and-drop math separated from the business logic of AI data fetching, adhering to the project's strict Atomic Design rules.

**2. State Management**
State for the lyrics input and the returned feedback payload will be kept locally within `AiFeedbackView` using `useState`.
*Rationale:* Because the feedback is transient and triggered by a user action (clicking "Analyze"), we don't need TanStack Query or global state. A simple React state coupled with Next.js Server Actions is sufficient and lightweight.

**3. Integration with Editor Canvas**
We will add `"ai-assistant"` to the `openPanels` Set in `EditorPage.tsx`.
*Rationale:* This uses the existing infrastructure for window management, meaning the toggle button in the bottom right will work identically to the Thesaurus or Snippets tools.

## Risks / Trade-offs

- **Risk:** The floating panel might obscure the text the user is trying to write.
  **Mitigation:** Ensure the panel is easily draggable, has a defined maximum width/height, and can be quickly dismissed via the existing panel toggle or an internal close button.
- **Risk:** The user pastes too much text, hitting token limits or causing UI overflow.
  **Mitigation:** Implement a strict character/word count limit on the textarea input state before allowing submission.
