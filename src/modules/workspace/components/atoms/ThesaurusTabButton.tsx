interface ThesaurusTabButtonProps {
  label: string
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
}

export function ThesaurusTabButton({ label, isActive, isDisabled, onClick }: ThesaurusTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      title={isDisabled ? "Coming soon" : undefined}
      className={[
        "px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap",
        isActive
          ? "text-foreground border-b-2 border-purple-500"
          : "text-muted-foreground border-b-2 border-transparent",
        isDisabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:text-foreground cursor-pointer",
      ].join(" ")}
    >
      {label}
    </button>
  )
}
