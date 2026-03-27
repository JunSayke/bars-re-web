## MODIFIED Requirements

### Requirement: Debounced auto-save
The editor SHALL automatically save the current bars to the Supabase backend after the user stops typing for 1 second, with a maximum save interval of 30 seconds regardless of ongoing editing. The save serializes the full `Bar[]` array to JSON and writes it to `sessions.bar_content` along with an updated `last_modified_at` timestamp. The save is scoped to the authenticated user via `user_id`.

#### Scenario: Auto-save triggers after idle
- **WHEN** the user stops typing for 1 second
- **THEN** the editor SHALL serialize the current bars to JSON and dispatch a `saveDraft` call that performs `UPDATE sessions SET bar_content = <json>, last_modified_at = now() WHERE id = <sessionId> AND user_id = <authUserId>`

#### Scenario: Auto-save triggers at 30-second ceiling
- **WHEN** the user is continuously typing and 30 seconds have elapsed since the last save
- **THEN** the editor SHALL serialize the current bars to JSON and dispatch a `saveDraft` call regardless of current typing activity

#### Scenario: Word limit blocks auto-save
- **WHEN** the total word count exceeds 1000 at the time of auto-save
- **THEN** the save SHALL be blocked client-side and the auto-save status SHALL show a limit warning without issuing a Supabase call

#### Scenario: Unauthorized user cannot save
- **WHEN** `supabase.auth.getUser()` returns no authenticated user at save time
- **THEN** `saveDraft` SHALL throw an `{ message: "Unauthorized" }` error and the auto-save status SHALL show "Save failed"

---

### Requirement: Load session bars on mount
The editor SHALL load the session's bar data and associated beat metadata from Supabase when the `EditorPage` mounts.

#### Scenario: Session with bars loads correctly
- **WHEN** `EditorPage` mounts with a valid `sessionId`
- **THEN** the editor SHALL perform `SELECT id, title, bar_content, ... FROM sessions WHERE id = <sessionId> AND user_id = <authUserId>`, deserialize `bar_content` from JSON, and render the bar rows grouped by their `section` field

#### Scenario: Session with linked beat restores player on mount
- **WHEN** `getSession` returns a session that has an associated `beat_files` row
- **THEN** `EditorPage` SHALL call `useBeatPlayer.loadUrl(beatStorageUrl, { fileName, bpm })` so the beat player is restored without requiring a re-upload

#### Scenario: Session with no bars shows empty editor
- **WHEN** `getSession` returns a session with `bar_content` of `null` or `"[]"`
- **THEN** the editor SHALL render one empty default bar input row in a "VERSE 1" section

#### Scenario: Malformed bar_content is treated as empty
- **WHEN** `bar_content` in the database contains invalid JSON
- **THEN** `getSession` SHALL return `bars: []`, the editor SHALL render with one empty bar row, and the next auto-save SHALL overwrite the corrupted content
