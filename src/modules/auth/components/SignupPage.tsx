"use client"

import { useRouter } from "next/navigation"
import { useSignupMutation } from "../hooks/useSignupMutation"
import { SignupForm } from "./organisms/SignupForm"
import { SignupBrandPanel } from "./organisms/SignupBrandPanel"
import { AuthShell } from "./templates/AuthShell"

export function SignupPage() {
  const router = useRouter()
  const { mutate, isPending, error } = useSignupMutation()

  return (
    <AuthShell
      aside={<SignupBrandPanel />}
      form={
        <SignupForm
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
