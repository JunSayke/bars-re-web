"use client"

import { Suspense, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useResetPasswordMutation } from "../hooks/useResetPasswordMutation"
import { ResetPasswordForm } from "./organisms/ResetPasswordForm"
import { CenteredCardShell } from "./templates/CenteredCardShell"
import { ROUTES } from "@/shared/constants/routes"
import type { ResetPasswordDto } from "../schemas/auth.schema"

function ResetPageInner() {
  const router = useRouter()
  const { mutate, isPending, error } = useResetPasswordMutation()

  const handleSubmit = useCallback(
    (data: ResetPasswordDto) => {
      mutate({ ...data, token: "" }, { onSuccess: () => router.push(ROUTES.AUTH.LOGIN) })
    },
    [mutate, router]
  )

  return (
    <CenteredCardShell>
      <ResetPasswordForm
        onSubmit={handleSubmit}
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
