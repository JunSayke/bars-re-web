"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { signupSchema, type SignupDto } from "../../schemas/auth.schema"
import { PasswordField } from "../molecules/PasswordField"
import { OAuthDivider } from "../atoms/OAuthDivider"
import { useGoogleAuthMutation } from "../../hooks/useGoogleAuthMutation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { AuthError } from "../../types/auth.types"

interface SignupFormProps {
  onSubmit: (data: SignupDto) => void
  isPending: boolean
  serverError?: AuthError | null
}

export function SignupForm({ onSubmit, isPending, serverError }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupDto>({
    resolver: zodResolver(signupSchema),
    defaultValues: { terms: false },
  })

  const termsChecked = watch("terms")

  const { mutate: googleSignIn, isPending: isGooglePending } = useGoogleAuthMutation()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
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

      <PasswordField
        label="Password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Repeat your password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="space-y-1.5">
        <div className="flex items-start gap-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-0.5"
              />
            )}
          />
          <Label htmlFor="terms" className="cursor-pointer font-normal leading-snug">
            I agree to the{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-xs text-destructive">{errors.terms.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!termsChecked || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Sign Up"
        )}
      </Button>

      <OAuthDivider />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isGooglePending || isPending}
        onClick={() => googleSignIn()}
      >
        {isGooglePending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already a member?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  )
}
