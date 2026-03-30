import type { ReactNode } from "react"

interface EditorShellProps {
  topNav: ReactNode
  children: ReactNode
  bottomBar?: ReactNode
  contentMaxWidth?: number
}

export function EditorShell({ topNav, children, bottomBar, contentMaxWidth }: EditorShellProps) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {topNav}
      <main className="flex-1 overflow-y-auto">
        <div
          className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8"
          style={contentMaxWidth !== undefined ? { maxWidth: contentMaxWidth } : undefined}
        >
          {children}
        </div>
      </main>
      {bottomBar}
    </div>
  )
}
