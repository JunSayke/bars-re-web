## 1. Route Handler

- [x] 1.1 Create `app/api/thesaurus/lookup/route.ts` with a `GET` handler
- [x] 1.2 Add Zod validation for the `query` search param; return `400 { error: "query is required" }` when blank or missing
- [x] 1.3 Import `lookup` and `fuzzySearch` from `@junsayke/cebuano-thesaurus` in the Route Handler
- [x] 1.4 Implement `mapEntry(entry: ThesaurusEntry): WordLookupResult` — flatten `senses[].translations` into `definitions[]`; map to `translations[]` as `{ language: "en", translation }`; map `subentries[].headword` to `homonyms[]`
- [x] 1.5 Call `lookup(query)` first; if result is non-null, return `mapEntry(result)`
- [x] 1.6 On null result, call `fuzzySearch(query, 10)` and return a `WordLookupResult` with empty `definitions` and `translations`, and `homonyms` populated from matched headwords with `shortDefinition: "fuzzy match"`
- [x] 1.7 Ensure the route file does NOT export `runtime = "edge"` (must stay Node.js for `better-sqlite3`)

## 2. Client Service

- [x] 2.1 Update `src/modules/workspace/services/thesaurus.service.ts` — replace the `BASE` constant and the old fetch URL with `/api/thesaurus/lookup?query=<term>`
- [x] 2.2 Remove the `NEXT_PUBLIC_API_URL` reference from the thesaurus service (verify no other module in this file uses it before deleting)
- [x] 2.3 Confirm `handleResponse` re-throw still propagates non-OK responses so `isError` is set in TanStack Query

## 3. Type Alignment

- [x] 3.1 Review `src/modules/workspace/types/thesaurus.types.ts` — verify `WordLookupResult`, `HomonymEntry`, and `TranslationEntry` match the shapes produced by `mapEntry`; update field types only if a mismatch is found
- [x] 3.2 Add import of `ThesaurusEntry` type from `@junsayke/cebuano-thesaurus` in the Route Handler module (type-only import)

## 4. Verification

- [x] 4.1 Start dev server (`pnpm dev`) and open the workspace editor with the Thesaurus panel
- [x] 4.2 Search for an exact-match word (e.g., `dagat`) and verify `definitions`, `homonyms`, and `translations` are populated in the UI
- [x] 4.3 Search for a partial/misspelled word (e.g., `dagaaat`) and verify fuzzy-match chips appear in the homonyms row
- [x] 4.4 Submit an empty query directly to `GET /api/thesaurus/lookup` (e.g., via browser or curl) and verify `400` response
- [x] 4.5 Run `pnpm lint` and confirm no new TypeScript or ESLint errors
