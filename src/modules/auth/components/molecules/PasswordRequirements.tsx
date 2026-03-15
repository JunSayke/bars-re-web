import { Check } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface PasswordRequirementsProps {
  password: string
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const rules = [
    { label: "Must be at least 8 characters", met: password.length >= 8 },
    { label: "Include at least one number", met: /\d/.test(password) },
    { label: "Include one special character", met: /[^a-zA-Z0-9]/.test(password) },
  ]

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Password Requirements
      </p>
      <ul className="space-y-1">
        {rules.map(({ label, met }) => (
          <li key={label} className="flex items-center gap-2 text-sm">
            <Check
              className={cn(
                "size-3.5 shrink-0",
                met ? "text-green-500" : "text-muted-foreground/30"
              )}
            />
            <span className={cn(met ? "text-foreground" : "text-muted-foreground")}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
