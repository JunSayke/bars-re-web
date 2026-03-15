"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Lock, Loader2 } from "lucide-react"
import { forgotPasswordSchema, type ForgotPasswordDto } from "../../schemas/auth.schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { AuthError } from "../../types/auth.types"

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordDto) => void
  isPending: boolean
  serverError?: AuthError | null
}

export function ForgotPasswordForm({ onSubmit, isPending, serverError }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <div className="flex flex-col items-center gap-3 pb-2">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="size-6 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">Forgot your password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>
      </div>

      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError.message}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Reset Link →"
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
