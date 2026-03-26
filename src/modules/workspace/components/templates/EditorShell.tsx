import type { ReactNode } from "react"

interface EditorShellProps {
  topNav: ReactNode
  children: ReactNode
}

export function EditorShell({ topNav, children }: EditorShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {topNav}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
