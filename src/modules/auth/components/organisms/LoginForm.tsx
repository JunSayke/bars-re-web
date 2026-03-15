"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { loginSchema, type LoginDto } from "../../schemas/auth.schema"
import { PasswordField } from "../molecules/PasswordField"
import { OAuthDivider } from "../atoms/OAuthDivider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { AuthError } from "../../types/auth.types"

interface LoginFormProps {
  onSubmit: (data: LoginDto) => void
  isPending: boolean
  serverError?: AuthError | null
}

export function LoginForm({ onSubmit, isPending, serverError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-5">
      {serverError && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {serverError.message}
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="identifier">Email</Label>
        <Input
          id="identifier"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.identifier}
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="text-xs text-destructive">{errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Password</Label>
          <Link
            href="/forgot"
            className="text-xs text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <PasswordField
          {...register("password")}
          error={errors.password?.message}
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Logging in…
          </>
        ) : (
          "Log In"
        )}
      </Button>

      <OAuthDivider />

      {/* TODO: integrate OAuth */}
      <Button type="button" variant="outline" className="w-full" disabled>
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
