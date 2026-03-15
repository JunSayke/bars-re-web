import type { ReactNode } from "react"

interface CenteredCardShellProps {
  children: ReactNode
}

export function CenteredCardShell({ children }: CenteredCardShellProps) {
  return (
    <div className="flex-1 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl p-8 shadow-lg">
        {children}
      </div>
    </div>
  )
}
