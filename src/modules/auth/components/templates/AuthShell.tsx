import type { ReactNode } from "react"

interface AuthShellProps {
  aside: ReactNode
  form: ReactNode
}

export function AuthShell({ aside, form }: AuthShellProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2 bg-background">
      {/* Left brand column — hidden on mobile */}
      <div className="hidden lg:flex">{aside}</div>

      {/* Right form column */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        {form}
      </div>
    </div>
  )
}
