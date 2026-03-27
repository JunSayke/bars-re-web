import type { Bar, SectionType } from "../../schemas/workspace.schema"
import { SectionGroup } from "../molecules/SectionGroup"
import { WordCountIndicator } from "../atoms/WordCountIndicator"

export interface SectionData {
  key: string
  label: string
  bars: Bar[]
}

interface BarsEditorProps {
  sections: SectionData[]
  wordCount: number
  onBarChange: (barId: string, text: string) => void
  onAddBar: (afterBarId: string) => void
  onRemoveBar: (barId: string) => void
  onPasteLines: (atBarId: string, lines: string[]) => void
  onSectionTypeChange: (sectionKey: string, newType: SectionType) => void
  onAddSection: (afterSectionKey: string) => void
  onRemoveSection: (sectionKey: string) => void
  onMoveSection: (sectionKey: string, direction: "up" | "down") => void
  /** Bar ID that should receive focus (propagated from EditorPage caret switching). */
  focusBarId?: string | null
}

export function BarsEditor({
  sections,
  wordCount,
  onBarChange,
  onAddBar,
  onRemoveBar,
  onPasteLines,
  onSectionTypeChange,
  onAddSection,
  onRemoveSection,
  onMoveSection,
  focusBarId,
}: BarsEditorProps) {
  const totalBarCount = sections.reduce((sum, s) => sum + s.bars.length, 0)

  const sectionOffsets = sections.map((_, idx) =>
    sections.slice(0, idx).reduce((sum, s) => sum + s.bars.length, 0)
  )

  return (
    <div className="flex flex-col gap-6">
      {sections.map((section, idx) => {
        const offset = sectionOffsets[idx]
        return (
          <SectionGroup
            key={section.key}
            sectionKey={section.key}
            sectionLabel={section.label}
            bars={section.bars}
            globalBarOffset={offset}
            onBarChange={onBarChange}
            onAddBar={onAddBar}
            onRemoveBar={onRemoveBar}
            onPasteLines={onPasteLines}
            totalBarCount={totalBarCount}
            onSectionTypeChange={onSectionTypeChange}
            onAddSection={onAddSection}
            onRemoveSection={onRemoveSection}
            onMoveSection={onMoveSection}
            isRemoveSectionDisabled={sections.length <= 1}
            isFirstSection={idx === 0}
            isLastSection={idx === sections.length - 1}
            focusBarId={focusBarId}
          />
        )
      })}
      <div className="flex justify-end pt-2 border-t border-border/40">
        <WordCountIndicator wordCount={wordCount} />
      </div>
    </div>
  )
}
