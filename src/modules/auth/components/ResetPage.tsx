"use client"

import { Suspense, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useResetPasswordMutation } from "../hooks/useResetPasswordMutation"
import { ResetPasswordForm } from "./organisms/ResetPasswordForm"
import { CenteredCardShell } from "./templates/CenteredCardShell"
import { ROUTES } from "@/shared/constants/routes"
import type { ResetPasswordDto } from "../schemas/auth.schema"

function ResetPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hasToken = searchParams.get("recovery") === "1"
  const { mutate, isPending, error } = useResetPasswordMutation()

  useEffect(() => {
    if (!hasToken) {
      router.replace("/")
    }
  }, [hasToken, router])

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
        hasToken={hasToken}
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
