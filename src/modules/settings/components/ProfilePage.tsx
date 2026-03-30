"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserCircle2, Mail, KeyRound, Info } from "lucide-react"
import { supabase } from "@/shared/config/supabase"
import { useProfileQuery } from "../hooks/useProfileQuery"
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation"
import { useUpdateEmailMutation } from "../hooks/useUpdateEmailMutation"
import { useUpdatePasswordMutation } from "../hooks/useUpdatePasswordMutation"
import {
  updateProfilePayloadSchema,
  updateEmailPayloadSchema,
  updatePasswordPayloadSchema,
} from "../schemas/settings.schema"
import type { UpdateProfilePayload, UpdateEmailPayload, UpdatePasswordPayload } from "../types/settings.types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ROUTES } from "@/shared/constants/routes"

export function ProfilePage() {
  const router = useRouter()
  const { profile, isLoading, isError } = useProfileQuery()
  const updateMutation = useUpdateProfileMutation()
  const emailMutation = useUpdateEmailMutation()
  const passwordMutation = useUpdatePasswordMutation()

  const [isGoogleUser, setIsGoogleUser] = useState(false)
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const provider = data.user?.app_metadata?.provider
      setIsGoogleUser(provider === "google")
    })
  }, [])

  const profileForm = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfilePayloadSchema),
    defaultValues: { displayName: "", avatarUrl: null },
  })
  const { register, handleSubmit, reset, control, formState: { errors, isDirty } } = profileForm
  const watchedAvatarUrl = useWatch({ control, name: "avatarUrl" })

  const emailForm = useForm<UpdateEmailPayload>({
    resolver: zodResolver(updateEmailPayloadSchema),
    defaultValues: { newEmail: "" },
  })

  const passwordForm = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordPayloadSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  // Sync form with fetched profile data
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
      })
    }
  }, [profile, reset])

  const onProfileSubmit = (data: UpdateProfilePayload) => {
    updateMutation.mutate(data, {
      onSuccess: (updated) => {
        reset({ displayName: updated.displayName, avatarUrl: updated.avatarUrl })
      },
    })
  }

  const onEmailSubmit = (data: UpdateEmailPayload) => {
    emailMutation.mutate(data, { onSuccess: () => emailForm.reset() })
  }

  const onPasswordSubmit = (data: UpdatePasswordPayload) => {
    passwordMutation.mutate(data, { onSuccess: () => router.push(ROUTES.AUTH.LOGIN) })
  }

  const shell = "mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 py-10"

  if (isLoading) {
    return (
      <div className={shell}>
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-secondary/60" />
          <div className="h-32 rounded bg-secondary/60" />
          <div className="h-32 rounded bg-secondary/60" />
          <div className="h-32 rounded bg-secondary/60" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={shell}>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground text-sm">Failed to load profile.</p>
          <button
            type="button"
            className="text-xs underline text-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={shell}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your display name and avatar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

      {/* Profile */}
      <Card className="border-border/40 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
              <UserCircle2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Your display name and avatar.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="size-20">
              <AvatarImage src={watchedAvatarUrl ?? undefined} alt={profile?.displayName ?? "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="Your display name"
                aria-invalid={!!errors.displayName}
                {...register("displayName")}
              />
              {errors.displayName && (
                <p className="text-xs text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://example.com/avatar.png"
                aria-invalid={!!errors.avatarUrl}
                {...register("avatarUrl")}
              />
              {errors.avatarUrl && (
                <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>
              )}
              <p className="text-xs text-muted-foreground">Paste a link to your avatar image.</p>
            </div>

            <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
              {updateMutation.isPending ? (
                <><Loader2 className="size-4 animate-spin" />Saving…</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Right column: Email + Password */}
      <div className="flex flex-col gap-6">

      {/* Change Email */}
      <Card className="border-border/40 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
              <Mail className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Change Email</CardTitle>
              <CardDescription>Update the email address for your account.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isGoogleUser ? (
            <div className="flex items-start gap-2 rounded-md border border-border/40 bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>Your email is managed by Google and cannot be changed here.</span>
            </div>
          ) : (
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentEmail">Current Email</Label>
              <Input
                id="currentEmail"
                type="email"
                value={profile?.email ?? ""}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newEmail">New Email</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="new@example.com"
                aria-invalid={!!emailForm.formState.errors.newEmail}
                {...emailForm.register("newEmail")}
              />
              {emailForm.formState.errors.newEmail && (
                <p className="text-xs text-destructive">{emailForm.formState.errors.newEmail.message}</p>
              )}
            </div>
            <Button type="submit" disabled={emailMutation.isPending || !emailForm.formState.isDirty}>
              {emailMutation.isPending ? (
                <><Loader2 className="size-4 animate-spin" />Updating…</>
              ) : (
                "Update Email"
              )}
            </Button>
          </form>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="border-border/40 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary">
              <KeyRound className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Choose a strong password to secure your account.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isGoogleUser ? (
            <div className="flex items-start gap-2 rounded-md border border-border/40 bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>Your password is managed by Google and cannot be changed here.</span>
            </div>
          ) : (
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!passwordForm.formState.errors.currentPassword}
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!passwordForm.formState.errors.newPassword}
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!passwordForm.formState.errors.confirmPassword}
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" disabled={passwordMutation.isPending || !passwordForm.formState.isDirty}>
              {passwordMutation.isPending ? (
                <><Loader2 className="size-4 animate-spin" />Updating…</>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
          )}
        </CardContent>
      </Card>

      </div>{/* end right column */}
      </div>{/* end grid */}
    </div>
  )
}
