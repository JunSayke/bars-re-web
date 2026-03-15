"use client"

import { useForgotPasswordMutation } from "../hooks/useForgotPasswordMutation"
import { ForgotPasswordForm } from "./organisms/ForgotPasswordForm"
import { CenteredCardShell } from "./templates/CenteredCardShell"

export function ForgotPage() {
  const { mutate, isPending, error, isSuccess } = useForgotPasswordMutation()

  if (isSuccess) {
    return (
      <CenteredCardShell>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Check your inbox</h2>
          <p className="text-sm text-muted-foreground">
            If an account with that email exists, we&apos;ve sent a password reset link.
          </p>
        </div>
      </CenteredCardShell>
    )
  }

  return (
    <CenteredCardShell>
      <ForgotPasswordForm
        onSubmit={(data) => mutate(data)}
        isPending={isPending}
        serverError={error}
      />
    </CenteredCardShell>
  )
}
