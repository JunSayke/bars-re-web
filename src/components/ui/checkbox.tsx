"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  "aria-invalid"?: boolean | "true" | "false"
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      data-state={checked ? "checked" : "unchecked"}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow-xs transition-colors outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring",
        "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {checked && <Check className="size-3 text-current" />}
    </button>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
