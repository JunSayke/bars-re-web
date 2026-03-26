interface HomonymChipProps {
  word: string
  onClick: (word: string) => void
}

export function HomonymChip({ word, onClick }: HomonymChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(word)}
      className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
    >
      {word}
    </button>
  )
}
