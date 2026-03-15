"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useResetPasswordMutation } from "../hooks/useResetPasswordMutation"
import { ResetPasswordForm } from "./organisms/ResetPasswordForm"
import { CenteredCardShell } from "./templates/CenteredCardShell"

function ResetPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const { mutate, isPending, error } = useResetPasswordMutation()

  if (!token) {
    return (
      <CenteredCardShell>
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-destructive">Invalid reset link</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is missing or invalid. Please request a new one.
          </p>
        </div>
      </CenteredCardShell>
    )
  }

  return (
    <CenteredCardShell>
      <ResetPasswordForm
        onSubmit={(data) =>
          mutate({ ...data, token }, { onSuccess: () => router.push("/login") })
        }
        isPending={isPending}
        serverError={error}
      />
    </CenteredCardShell>
  )
}

export function ResetPage() {
  return (
    <Suspense fallback={null}>
      <ResetPageInner />
    </Suspense>
  )
}
