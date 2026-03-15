"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "../hooks/useLoginMutation"
import { LoginForm } from "./organisms/LoginForm"
import { LoginBrandPanel } from "./organisms/LoginBrandPanel"
import { AuthShell } from "./templates/AuthShell"
import { ROUTES } from "@/shared/constants/routes"
import type { LoginDto } from "../schemas/auth.schema"

export function LoginPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useLoginMutation()

  const handleSubmit = useCallback(
    (data: LoginDto) => {
      mutate(data, { onSuccess: () => router.push(ROUTES.WORKSPACES.INDEX) })
    },
    [mutate, router]
  )

  return (
    <AuthShell
      aside={<LoginBrandPanel />}
      form={
        <LoginForm
          onSubmit={handleSubmit}
          isPending={isPending}
          serverError={error}
        />
      }
    />
  )
}
