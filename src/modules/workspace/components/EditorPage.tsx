"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useGetSessionQuery } from "../hooks/useGetSessionQuery"
import { useSaveDraftMutation } from "../hooks/useSaveDraftMutation"
import { useBeatPlayer } from "../hooks/useBeatPlayer"
import { useSnippetsQuery } from "../hooks/useSnippetsQuery"
import { useCreateSnippetMutation } from "../hooks/useCreateSnippetMutation"
import { useUpdateSnippetMutation } from "../hooks/useUpdateSnippetMutation"
import { useDeleteSnippetMutation } from "../hooks/useDeleteSnippetMutation"
import type { Bar, SectionType } from "../schemas/workspace.schema"
import type { Snippet, CreateSnippetPayload } from "../types/snippet.types"
import type { SaveStatus } from "./atoms/AutoSaveStatusIndicator"
import { AutoSaveStatusIndicator } from "./atoms/AutoSaveStatusIndicator"
import type { SectionData } from "./organisms/BarsEditor"
import { BarsEditor } from "./organisms/BarsEditor"
import { BeatPlayerBar } from "./organisms/BeatPlayerBar"
import { EditorTopNav } from "./organisms/EditorTopNav"
import { WorkspaceWindowMenu } from "./organisms/WorkspaceWindowMenu"
import { SnippetList } from "./organisms/SnippetList"
import { SnippetFormDialog } from "./molecules/SnippetFormDialog"
import { EditorShell } from "./templates/EditorShell"
import { SnippetsPanel } from "./templates/SnippetsPanel"
import { ThesaurusPanel } from "./templates/ThesaurusPanel"
import { AiAssistantPanel } from "./templates/AiAssistantPanel"
import { AiFeedbackView } from "./organisms/AiFeedbackView"
import { BeatLinkPanel } from "./templates/BeatLinkPanel"

function groupBars(bars: Bar[]): SectionData[] {
  const map = new Map<string, Bar[]>()
  const sectionFirstOrder = new Map<string, number>()

  for (const bar of bars) {
    const list = map.get(bar.section) ?? []
    list.push(bar)
    map.set(bar.section, list)

    if (!sectionFirstOrder.has(bar.section) || bar.order < sectionFirstOrder.get(bar.section)!) {
      sectionFirstOrder.set(bar.section, bar.order)
    }
  }

  const sorted = [...map.entries()].sort(
    ([a], [b]) => (sectionFirstOrder.get(a) ?? 0) - (sectionFirstOrder.get(b) ?? 0)
  )

  return sorted.map(([key, sectionBars]) => ({
    key,
    label: key
      .replace(/-?(\d+)$/, " $1")
      .replace(/^(\w)/, (c) => c.toUpperCase())
      .toUpperCase(),
    bars: [...sectionBars].sort((a, b) => a.order - b.order),
  }))
}

function countWords(bars: Bar[]): number {
  return bars.reduce((total, bar) => {
    const words = bar.text.trim().split(/\s+/).filter(Boolean)
    return total + words.length
  }, 0)
}

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

export function EditorPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("id") ?? ""
  const { session, isLoading, isError } = useGetSessionQuery(sessionId)
  const { mutate: saveMutate, isPending, isError: isSaveError, isSuccess: isSaveSuccess } =
    useSaveDraftMutation(sessionId)
  const beatPlayer = useBeatPlayer(sessionId)

  // ── Snippet data hooks ────────────────────────────────────────────────────
  const { snippets, isLoading: snippetsLoading } = useSnippetsQuery()
  const createSnippet = useCreateSnippetMutation()
  const updateSnippet = useUpdateSnippetMutation()
  const deleteSnippet = useDeleteSnippetMutation()

  // ── Panel open/close state ────────────────────────────────────────────────
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set())
  const handleTogglePanel = (key: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // ── Panel z-index (bring-to-front) ────────────────────────────────────────
  const panelZCounter = useRef(53)
  const [panelZIndexes, setPanelZIndexes] = useState<Record<string, number>>({
    snippets: 50,
    thesaurus: 51,
    "beat-link": 52,
  })
  const handlePanelActivate = (key: string) => {
    setPanelZIndexes((prev) => ({ ...prev, [key]: panelZCounter.current++ }))
  }

  // ── Snippet form dialog state ─────────────────────────────────────────────
  const [snippetDialogOpen, setSnippetDialogOpen] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null)

  const handleNewSnippet = () => {
    setEditingSnippet(null)
    setSnippetDialogOpen(true)
  }

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet)
    setSnippetDialogOpen(true)
  }

  const handleSnippetFormSubmit = (data: CreateSnippetPayload) => {
    if (editingSnippet) {
      updateSnippet.mutate(
        { id: editingSnippet.id, payload: data },
        { onSuccess: () => setSnippetDialogOpen(false) }
      )
    } else {
      createSnippet.mutate(data, {
        onSuccess: () => setSnippetDialogOpen(false),
        onError: (err: unknown) => {
          const msg = (err as { message?: string })?.message ?? "Failed to create snippet."
          toast.error(msg)
        },
      })
    }
  }

  const handleDeleteSnippet = (snippet: Snippet) => {
    deleteSnippet.mutate(snippet.id)
  }

  const handleInsertSnippet = (content: string) => {
    const lines = content.split("\n").filter((l) => l.trim().length > 0)
    if (lines.length === 0) return
    setBars((prev) => {
      const existingKeys = [...new Set(prev.map((b) => b.section))]
      const verseNumbers = existingKeys
        .map((k) => k.match(/^verse-(\d+)$/))
        .filter(Boolean)
        .map((m) => Number(m![1]))
      const nextVerseNum = verseNumbers.length > 0 ? Math.max(...verseNumbers) + 1 : 1
      const newSectionKey = `verse-${nextVerseNum}`
      const startOrder = prev.length
      const newBars: Bar[] = lines.map((line, i) => ({
        id: generateId(),
        text: line,
        section: newSectionKey,
        order: startOrder + i,
      }))
      return [...prev, ...newBars]
    })
  }

  // Seed beat player on mount when session has a persisted beat
  const initializedBeatIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (
      session?.beat &&
      session.beat.beatFileId !== initializedBeatIdRef.current
    ) {
      initializedBeatIdRef.current = session.beat.beatFileId
      beatPlayer.loadUrl(session.beat.beatStorageUrl, {
        fileName: session.beat.fileName,
        bpm: session.beat.bpm,
      })
    }
    return () => {
      // Reset so StrictMode re-mounts (and real unmount/remount) re-call loadUrl
      // with the fresh audio element created by useBeatPlayer's initialization effect
      initializedBeatIdRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.beat?.beatFileId])

  const [bars, setBars] = useState<Bar[]>([])
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const barsRef = useRef<Bar[]>([])
  const isAtWordLimitRef = useRef(false)
  // Tracks which bar ID should receive focus after a keyboard-driven add/remove
  const [focusBarId, setFocusBarId] = useState<string | null>(null)

  // Populate bars from loaded session; seed with one empty bar if session has none
  useEffect(() => {
    if (session) {
      if (session.bars.length === 0) {
        setBars([{ id: generateId(), text: "", section: "verse-1", order: 0 }])
      } else {
        setBars(session.bars)
      }
    }
  }, [session])

  // Sync save status from mutation state
  useEffect(() => {
    if (isPending) setSaveStatus("saving")
    else if (isSaveSuccess) setSaveStatus("saved")
    else if (isSaveError) setSaveStatus("error")
  }, [isPending, isSaveSuccess, isSaveError])

  const wordCount = countWords(bars)
  const isAtWordLimit = wordCount >= 1000

  // Keep refs current so the 30s interval always reads latest values
  const isUploadingRef = useRef(false)
  useEffect(() => { barsRef.current = bars }, [bars])
  useEffect(() => { isAtWordLimitRef.current = isAtWordLimit }, [isAtWordLimit])
  useEffect(() => { isUploadingRef.current = beatPlayer.isUploading }, [beatPlayer.isUploading])

  // 1s debounce auto-save — paused while a beat upload is in flight
  useEffect(() => {
    if (!session || bars.length === 0 || isAtWordLimit || beatPlayer.isUploading) return
    const timer = setTimeout(() => {
      saveMutate({ bars })
    }, 1_000)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bars, beatPlayer.isUploading])

  // 30s ceiling auto-save — uses refs to avoid stale closure
  useEffect(() => {
    if (!session) return
    const interval = setInterval(() => {
      if (isAtWordLimitRef.current || !barsRef.current.length || isUploadingRef.current) return
      saveMutate({ bars: barsRef.current })
    }, 30_000)
    return () => clearInterval(interval)
  }, [session, saveMutate])

  const handleBarChange = (barId: string, text: string) => {
    setBars((prev) => prev.map((b) => (b.id === barId ? { ...b, text } : b)))
  }

  const handlePasteLines = (atBarId: string, lines: string[]) => {
    setBars((prev) => {
      const idx = prev.findIndex((b) => b.id === atBarId)
      if (idx === -1) return prev
      const [firstLine, ...rest] = lines
      const updatedBar = { ...prev[idx], text: firstLine }
      const newBars = rest.map((text, i) => ({
        id: generateId(),
        text,
        section: prev[idx].section,
        order: prev[idx].order + i + 1,
      }))
      const updated = [
        ...prev.slice(0, idx),
        updatedBar,
        ...newBars,
        ...prev.slice(idx + 1),
      ]
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }

  const handleAddBar = (afterBarId: string) => {
    // Generate ID here so we can set focusBarId before the state update (11.4)
    const newId = generateId()
    setFocusBarId(newId)
    setBars((prev) => {
      const idx = prev.findIndex((b) => b.id === afterBarId)
      if (idx === -1) return prev

      const ref = prev[idx]
      const newBar: Bar = {
        id: newId,
        text: "",
        section: ref.section,
        order: ref.order + 0.5,
      }

      const updated = [...prev.slice(0, idx + 1), newBar, ...prev.slice(idx + 1)]
      // Re-normalise order
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }

  const handleRemoveBar = (barId: string) => {
    // Determine focus target before mutating state (bars are stored in order)
    const idx = bars.findIndex((b) => b.id === barId)
    if (idx > 0) {
      // 11.5: move caret to the bar immediately above
      setFocusBarId(bars[idx - 1].id)
    } else if (bars.length > 1) {
      // 11.6: no bar above — move caret to the bar below
      setFocusBarId(bars[1].id)
    } else {
      // 11.7: last bar globally — section will disappear, no caret target
      setFocusBarId(null)
    }

    setBars((prev) => {
      // 11.7: allow removing the very last bar (section cleanup is implicit via groupBars)
      const updated = prev.filter((b) => b.id !== barId)
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }

  const handleSectionTypeChange = (sectionKey: string, newType: SectionType) => {
    const numberSuffix = sectionKey.match(/-?(\d+)$/)?.[1]
    const newKey = numberSuffix ? `${newType}-${numberSuffix}` : newType
    setBars((prev) =>
      prev.map((b) => (b.section === sectionKey ? { ...b, section: newKey } : b))
    )
  }

  const handleAddSection = (afterSectionKey: string) => {
    setBars((prev) => {
      const existingKeys = [...new Set(prev.map((b) => b.section))]
      const verseNumbers = existingKeys
        .map((k) => k.match(/^verse-(\d+)$/))
        .filter(Boolean)
        .map((m) => Number(m![1]))
      const nextVerseNum = verseNumbers.length > 0 ? Math.max(...verseNumbers) + 1 : 1
      const newSectionKey = `verse-${nextVerseNum}`

      // Insert one empty bar after the last bar of afterSectionKey
      const lastBarIdx = prev.reduce((maxIdx, b, i) =>
        b.section === afterSectionKey ? i : maxIdx, -1)

      const insertAt = lastBarIdx === -1 ? prev.length : lastBarIdx + 1
      const newBar: Bar = {
        id: generateId(),
        text: "",
        section: newSectionKey,
        order: insertAt,
      }

      const updated = [
        ...prev.slice(0, insertAt),
        newBar,
        ...prev.slice(insertAt),
      ]
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }

  const handleMoveSection = (sectionKey: string, direction: "up" | "down") => {
    const currentSections = groupBars(bars)
    const idx = currentSections.findIndex((s) => s.key === sectionKey)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= currentSections.length) return

    const reordered = [...currentSections]
    const temp = reordered[idx]
    reordered[idx] = reordered[swapIdx]
    reordered[swapIdx] = temp

    const newBars: Bar[] = []
    let order = 0
    for (const section of reordered) {
      for (const bar of section.bars) {
        newBars.push({ ...bar, order: order++ })
      }
    }
    setBars(newBars)
  }

  const handleRemoveSection = (sectionKey: string) => {
    setBars((prev) => {
      const sectionCount = new Set(prev.map((b) => b.section)).size
      if (sectionCount <= 1) return prev
      const updated = prev.filter((b) => b.section !== sectionKey)
      return updated.map((b, i) => ({ ...b, order: i }))
    })
  }

  if (isLoading) {
    return (
      <EditorShell
        topNav={<EditorTopNav sessionTitle="Loading…" />}
      >
        <div className="flex flex-col gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 rounded bg-secondary/60" />
          ))}
        </div>
      </EditorShell>
    )
  }

  if (isError) {
    return (
      <EditorShell
        topNav={<EditorTopNav sessionTitle="Error" />}
      >
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground text-sm">Failed to load session.</p>
          <button
            type="button"
            className="text-xs underline text-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </EditorShell>
    )
  }

  const sections = groupBars(bars)

  return (
    <>
      <EditorShell
        topNav={
          <EditorTopNav sessionTitle={session?.title ?? ""} />
        }
        bottomBar={<BeatPlayerBar {...beatPlayer} />}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {isAtWordLimit && (
              <span className="text-xs text-destructive font-medium">
                Word limit reached — save blocked
              </span>
            )}
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const allText = bars.map((b) => b.text).join("\n")
                  navigator.clipboard.writeText(allText).then(() => toast.success("Copied to clipboard"))
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy all bars to clipboard"
              >
                Copy All
              </button>
              <AutoSaveStatusIndicator status={saveStatus} />
            </div>
          </div>
          <BarsEditor
            sections={sections}
            wordCount={wordCount}
            onBarChange={handleBarChange}
            onAddBar={handleAddBar}
            onRemoveBar={handleRemoveBar}
            onPasteLines={handlePasteLines}
            onSectionTypeChange={handleSectionTypeChange}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            onMoveSection={handleMoveSection}
            focusBarId={focusBarId}
          />
        </div>
      </EditorShell>

      <WorkspaceWindowMenu openPanels={openPanels} onToggle={handleTogglePanel} />

      {openPanels.has("ai-assistant") && (
        <AiAssistantPanel onClose={() => handleTogglePanel("ai-assistant")}>
          <AiFeedbackView />
        </AiAssistantPanel>
      )}

      {openPanels.has("thesaurus") && (
        <ThesaurusPanel
          onClose={() => handleTogglePanel("thesaurus")}
          onActivate={() => handlePanelActivate("thesaurus")}
          zIndex={panelZIndexes["thesaurus"]}
        />
      )}

      {openPanels.has("beat-link") && (
        <BeatLinkPanel
          sessionId={sessionId}
          onClose={() => handleTogglePanel("beat-link")}
          onActivate={() => handlePanelActivate("beat-link")}
          zIndex={panelZIndexes["beat-link"]}
        />
      )}

      {openPanels.has("snippets") && (
        <SnippetsPanel
          onClose={() => handleTogglePanel("snippets")}
          onActivate={() => handlePanelActivate("snippets")}
          zIndex={panelZIndexes["snippets"]}
        >
          <SnippetList
            snippets={snippets}
            isLoading={snippetsLoading}
            onInsert={(s) => handleInsertSnippet(s.content)}
            onEdit={handleEditSnippet}
            onDelete={handleDeleteSnippet}
            onNew={handleNewSnippet}
          />
        </SnippetsPanel>
      )}

      <SnippetFormDialog
        open={snippetDialogOpen}
        onOpenChange={setSnippetDialogOpen}
        defaultValues={
          editingSnippet
            ? { title: editingSnippet.title, content: editingSnippet.content, tags: editingSnippet.tags }
            : undefined
        }
        onSubmit={handleSnippetFormSubmit}
        isPending={createSnippet.isPending || updateSnippet.isPending}
      />
    </>
  )
}
