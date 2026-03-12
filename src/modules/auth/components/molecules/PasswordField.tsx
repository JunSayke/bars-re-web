"use client"

import * as React from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/shared/lib/utils"

interface PasswordFieldProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string
  error?: string
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    return (
      <div className="space-y-1.5">
        {label && (
          <Label htmlFor={inputId} className="text-foreground">
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          <Lock className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            id={inputId}
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn("pl-9 pr-10", className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
PasswordField.displayName = "PasswordField"
