import { countSyllables } from "@/shared/lib/syllable-count"
import type { Bar, SectionType } from "../../schemas/workspace.schema"
import { sectionTypeSchema } from "../../schemas/workspace.schema"
import { BarInputRow } from "../atoms/BarInputRow"
import { SectionBadge } from "../atoms/SectionBadge"

const SECTION_TYPES = sectionTypeSchema.options

interface SectionGroupProps {
  sectionKey: string
  sectionLabel: string
  bars: Bar[]
  globalBarOffset: number
  onBarChange: (barId: string, text: string) => void
  onAddBar: (afterBarId: string) => void
  onRemoveBar: (barId: string) => void
  onPasteLines: (atBarId: string, lines: string[]) => void
  totalBarCount: number
  onSectionTypeChange: (sectionKey: string, newType: SectionType) => void
  onAddSection: (afterSectionKey: string) => void
  onRemoveSection: (sectionKey: string) => void
  onMoveSection: (sectionKey: string, direction: "up" | "down") => void
  isRemoveSectionDisabled: boolean
  isFirstSection: boolean
  isLastSection: boolean
  /** ID of the bar that should receive keyboard focus (caret switching). */
  focusBarId?: string | null
  /** Move caret across bar/section boundaries with arrow keys. */
  onNavigateBar?: (barId: string, direction: "up" | "down") => void
}

export function SectionGroup({
  sectionKey,
  sectionLabel,
  bars,
  globalBarOffset,
  onBarChange,
  onAddBar,
  onRemoveBar,
  onPasteLines,
  totalBarCount,
  onSectionTypeChange,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  isRemoveSectionDisabled,
  isFirstSection,
  isLastSection,
  focusBarId,
  onNavigateBar,
}: SectionGroupProps) {
  const syllableCount = bars.reduce(
    (sum, bar) => sum + (bar.text.trim() ? countSyllables(bar.text) : 0),
    0
  )

  const currentType = sectionKey.replace(/-\d+$/, "") as SectionType

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-primary rounded-full" />
          <select
            value={currentType}
            onChange={(e) => onSectionTypeChange(sectionKey, e.target.value as SectionType)}
            className="text-[0.75em] font-bold uppercase tracking-widest text-muted-foreground bg-transparent border-none outline-none cursor-pointer hover:text-foreground transition-colors appearance-none [&>option]:text-black [&>option]:bg-white"
            aria-label="Section type"
          >
            {SECTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
          {sectionLabel.match(/\d+$/) && (
            <span className="text-[0.75em] font-bold uppercase tracking-widest text-muted-foreground pointer-events-none">
              {sectionLabel.match(/\d+$/)?.[0]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMoveSection(sectionKey, "up")}
            disabled={isFirstSection}
            className="text-[0.75em] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1"
            aria-label="Move section up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMoveSection(sectionKey, "down")}
            disabled={isLastSection}
            className="text-[0.75em] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1"
            aria-label="Move section down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => {
              const text = bars.map((b) => b.text).join("\n")
              navigator.clipboard.writeText(text)
            }}
            className="text-[0.75em] text-muted-foreground hover:text-foreground transition-colors px-1"
            aria-label="Copy section bars to clipboard"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={() => onRemoveSection(sectionKey)}
            disabled={isRemoveSectionDisabled}
            className="text-[0.75em] text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed px-1"
            aria-label="Remove section"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 pl-3 border-l border-border/40">
        {bars.map((bar, index) => (
          <BarInputRow
            key={bar.id}
            lineNumber={globalBarOffset + index + 1}
            value={bar.text}
            onChange={(text) => onBarChange(bar.id, text)}
            onAddAfter={() => onAddBar(bar.id)}
            onRemove={() => onRemoveBar(bar.id)}
            onPasteLines={(lines) => onPasteLines(bar.id, lines)}
            isRemoveDisabled={totalBarCount <= 1}
            isFocused={bar.id === focusBarId}
            onNavigatePrev={() => onNavigateBar?.(bar.id, "up")}
            onNavigateNext={() => onNavigateBar?.(bar.id, "down")}
          />
        ))}
      </div>
      <div className="mt-1 pl-3 flex items-center gap-4">
        <SectionBadge syllableCount={syllableCount} barCount={bars.length} />
        <button
          type="button"
          onClick={() => onAddSection(sectionKey)}
          className="text-[0.75em] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Add section after"
        >
          + Add Section
        </button>
      </div>
    </div>
  )
}
