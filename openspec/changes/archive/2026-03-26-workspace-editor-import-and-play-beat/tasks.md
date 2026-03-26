## 1. Types & Schema

- [x] 1.1 Add `BeatRecord` type (`beatUrl: string`, `bpm: number | null`, `fileName: string`) to `src/modules/workspace/types/`
- [x] 1.2 Add `BeatState` type (`beat: BeatRecord | null`, `isPlaying: boolean`, `currentTime: number`, `duration: number`) to `src/modules/workspace/types/`

## 2. MSW Mock Handler

- [x] 2.1 Add `POST /sessions/:id/beat` handler in `src/modules/workspace/mocks/` that validates the file field exists, and returns `{ beatUrl: "<mock-url>", bpm: 120, fileName: "<original filename>" }` with status 200
- [x] 2.2 Register the new handler in the workspace module's mock index so it is included in the MSW browser worker

## 3. React Query Hook — Import Beat Mutation

- [x] 3.1 Create `useImportBeatMutation` hook at `src/modules/workspace/hooks/useImportBeatMutation.ts` that calls `POST /sessions/:id/beat` using `fetch` with `FormData` and returns `BeatRecord` on success
- [x] 3.2 Hook should expose `{ mutate, isPending, isError, error }` using TanStack Query `useMutation`

## 4. Audio Player Hook

- [x] 4.1 Create `useBeatPlayer` hook at `src/modules/workspace/hooks/useBeatPlayer.ts` that manages `HTMLAudioElement` via `useRef`, local file object URL, and playback state
- [x] 4.2 Hook exposes: `loadFile(file: File): void`, `togglePlay(): void`, `skipBack(): void`, `seek(time: number): void`, `isPlaying`, `currentTime`, `duration`, `bpm`, `fileName`
- [x] 4.3 Hook calls `useImportBeatMutation` on file load, updates `bpm` and `fileName` from the mutation response
- [x] 4.4 Hook cleans up the previous object URL via `URL.revokeObjectURL` when a new file is loaded or the component unmounts

## 5. Atoms

- [x] 5.1 Create `BpmBadge` atom at `src/modules/workspace/components/atoms/BpmBadge.tsx` — renders the music-note icon + `{bpm} BPM` text using `--primary` accent color; accepts `bpm: number` prop
- [x] 5.2 Create `BeatProgressBar` atom at `src/modules/workspace/components/atoms/BeatProgressBar.tsx` — renders HTML range input (seek bar) + `MM:SS / MM:SS` timestamp; accepts `currentTime`, `duration`, `onSeek` props

## 6. Molecules

- [x] 6.1 Create `BeatTransportControls` molecule at `src/modules/workspace/components/molecules/BeatTransportControls.tsx` — renders skip-back icon button, play/pause icon button (filled purple circle), skip-forward icon button; accepts `isPlaying`, `onTogglePlay`, `onSkipBack`, `onSkipForward` props

## 7. Organism — BeatPlayerBar

- [x] 7.1 Create `BeatPlayerBar` organism at `src/modules/workspace/components/organisms/BeatPlayerBar.tsx`
- [x] 7.2 When no beat is loaded: render a left-aligned area with a file icon + "UPLOAD BEAT" label + "MP3/WAV Only" hint; clicking it triggers a hidden `<input type="file" accept=".mp3,.wav,.ogg">` limited to 20 MB
- [x] 7.3 When a beat is loaded: render left slot (file icon + file name + format hint), center slot (`BeatTransportControls`), right slot (`BpmBadge` + `BeatProgressBar`), all on the dark card background matching the reference UI
- [x] 7.4 File selection validates type (MP3/WAV/OGG) and size (≤ 20 MB) client-side; shows `sonner` toast on validation failure
- [x] 7.5 `BeatPlayerBar` consumes `useBeatPlayer` hook internally — it is self-contained

## 8. EditorShell Template Update

- [x] 8.1 Add optional `bottomBar?: ReactNode` prop to `EditorShell` at `src/modules/workspace/components/templates/EditorShell.tsx`
- [x] 8.2 Render `bottomBar` below the `<main>` scroll area using `flex-shrink-0` so it stays pinned to the viewport bottom

## 9. EditorPage Integration

- [x] 9.1 Import and render `BeatPlayerBar` in `src/modules/workspace/components/EditorPage.tsx`
- [x] 9.2 Pass `<BeatPlayerBar />` as the `bottomBar` prop to `EditorShell` in the happy-path render branch
- [x] 9.3 Ensure loading and error render branches in `EditorPage` do NOT pass a `bottomBar` (they already omit it since `bottomBar` is optional)

## 10. Verification

- [x] 10.1 Run `pnpm lint` and fix any TypeScript or ESLint errors introduced by this change
- [x] 10.2 Manually verify: open `/workspaces/editor`, click "Upload Beat", select a valid MP3 — confirm the player bar appears with "120 BPM", play/pause, seek, and skip-back all work
- [x] 10.3 Manually verify: attempt to upload an unsupported file type — confirm the error toast appears and no player renders
