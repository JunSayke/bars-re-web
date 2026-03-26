import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SnippetSearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export function SnippetSearchBar({ value, onChange, onSearch }: SnippetSearchBarProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search snippets…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="h-8 text-sm"
      />
      <Button size="sm" variant="secondary" className="h-8 px-3 text-xs" onClick={onSearch}>
        Search
      </Button>
    </div>
  )
}
