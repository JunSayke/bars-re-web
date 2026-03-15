"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSignupMutation } from "../hooks/useSignupMutation"
import { SignupForm } from "./organisms/SignupForm"
import { SignupBrandPanel } from "./organisms/SignupBrandPanel"
import { AuthShell } from "./templates/AuthShell"
import { ROUTES } from "@/shared/constants/routes"
import type { SignupDto } from "../schemas/auth.schema"

export function SignupPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useSignupMutation()

  const handleSubmit = useCallback(
    (data: SignupDto) => {
      mutate(data, { onSuccess: () => router.push(ROUTES.WORKSPACES.INDEX) })
    },
    [mutate, router]
  )

  return (
    <AuthShell
      aside={<SignupBrandPanel />}
      form={
        <SignupForm
          onSubmit={handleSubmit}
          isPending={isPending}
          serverError={error}
        />
      }
    />
  )
}
