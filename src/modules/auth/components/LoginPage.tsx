"use client"

import { useRouter } from "next/navigation"
import { useLoginMutation } from "../hooks/useLoginMutation"
import { LoginForm } from "./organisms/LoginForm"
import { LoginBrandPanel } from "./organisms/LoginBrandPanel"
import { AuthShell } from "./templates/AuthShell"

export function LoginPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useLoginMutation()

  return (
    <AuthShell
      aside={<LoginBrandPanel />}
      form={
        <LoginForm
          onSubmit={(data) =>
            mutate(data, { onSuccess: () => router.push("/workspaces") })
          }
          isPending={isPending}
          serverError={error}
        />
      }
    />
  )
}
