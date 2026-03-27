## Why

The Bisaya AI Rap editor currently has no vocabulary assistance tools. Lyricists need in-context access to word definitions, homonyms, and translations to craft richer, more accurate Bisaya lyrics without leaving the editor. The Word Lookup transaction is the foundational entry point for the entire Thesaurus module.

## What Changes

- Introduce a draggable, resizable floating panel ("transaction window") in the workspace editor for the Thesaurus module.
- Add the **Word Lookup** tab as the first of five thesaurus sub-tools (Word Lookup, Rhyme, Synonyms, Anagrams, Wordplay); only Word Lookup is in scope for this change.
- Wire the Word Lookup transaction to a mock API (MSW) that returns definition, homonyms, and translations for a queried Bisaya term.
- The "Thesaurus" toggle in the existing `WorkspaceWindowMenu` opens/closes this floating panel.
- The panel renders a "Navigate to Tool" (diamond arrow) button that pre-fills the current looked-up word into linked thesaurus tabs (forward-navigation stub for future changes).

## Capabilities

### New Capabilities

- `thesaurus-word-lookup`: Floating panel transaction in the workspace editor that allows the user to query a Bisaya word and receive its definition, homonyms, and English translations. Includes tab navigation shell for the full Thesaurus module (other tabs are stubs).

### Modified Capabilities

<!-- None — no existing spec-level requirements are changing. -->

## Impact

- **`src/modules/workspace/`** — New components (`ThesaurusPanel`, `WordLookupTab`, atoms), new hook (`useWordLookupQuery`), new mock handler and fixtures, new service stub.
- **`src/modules/workspace/components/EditorPage.tsx`** — Render `ThesaurusPanel` when "thesaurus" is in `openPanels`.
- **`src/modules/workspace/components/templates/`** — New `ThesaurusPanel.tsx` draggable/resizable shell (mirrors `SnippetsPanel.tsx` pattern).
- **No backend changes** — all data is mocked via MSW.
- **No new routes or pages** — purely in-editor floating window.
