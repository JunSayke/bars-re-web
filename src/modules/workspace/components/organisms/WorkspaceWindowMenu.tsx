import { Checkbox } from "@/components/ui/checkbox"

const PANEL_OPTIONS = [
  { key: "thesaurus", label: "Thesaurus" },
  { key: "ai-assistant", label: "AI Assistant" },
  { key: "snippets", label: "Snippets" },
  { key: "beat-link", label: "Beat Link" },
] as const

interface WorkspaceWindowMenuProps {
  openPanels: Set<string>
  onToggle: (key: string) => void
}

export function WorkspaceWindowMenu({ openPanels, onToggle }: WorkspaceWindowMenuProps) {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        Workspace
      </p>
      {PANEL_OPTIONS.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            id={`panel-${key}`}
            checked={openPanels.has(key)}
            onCheckedChange={() => onToggle(key)}
          />
          <span className="text-sm text-foreground">{label}</span>
        </label>
      ))}
    </div>
  )
}
