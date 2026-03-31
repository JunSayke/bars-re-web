"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { RotateCcw, Loader2 } from "lucide-react"
import { resetPasswordSchema, type ResetPasswordDto } from "../../schemas/auth.schema"
import { PasswordField } from "../molecules/PasswordField"
import { PasswordRequirements } from "../molecules/PasswordRequirements"
import { Button } from "@/components/ui/button"
import type { AuthError } from "../../types/auth.types"

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordDto) => void
  isPending: boolean
  serverError?: AuthError | null
  hasToken?: boolean
}

export function ResetPasswordForm({ onSubmit, isPending, serverError, hasToken = true }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const newPassword = watch("newPassword", "")

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <RotateCcw className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </div>
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError.message}
        </p>
      )}

      <PasswordField
        label="New Password"
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <PasswordField
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <PasswordRequirements password={newPassword} />

      {!hasToken && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          No reset token found. Please use the link from your password reset email.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending || !hasToken}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Updating…
          </>
        ) : (
          "Update Password →"
        )}
      </Button>

      <p className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          ← Back to Login
        </Link>
      </p>
    </form>
  )
}
