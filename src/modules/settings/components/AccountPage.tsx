"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Mail, KeyRound } from "lucide-react"
import { useProfileQuery } from "../hooks/useProfileQuery"
import { useUpdateEmailMutation } from "../hooks/useUpdateEmailMutation"
import { useUpdatePasswordMutation } from "../hooks/useUpdatePasswordMutation"
import { updateEmailPayloadSchema, updatePasswordPayloadSchema } from "../schemas/settings.schema"
import type { UpdateEmailPayload, UpdatePasswordPayload } from "../types/settings.types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AccountPage() {
  const { profile } = useProfileQuery()
  const emailMutation = useUpdateEmailMutation()
  const passwordMutation = useUpdatePasswordMutation()

  const emailForm = useForm<UpdateEmailPayload>({
    resolver: zodResolver(updateEmailPayloadSchema),
    defaultValues: { newEmail: "" },
  })

  const passwordForm = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordPayloadSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  const onEmailSubmit = (data: UpdateEmailPayload) => {
    emailMutation.mutate(data, {
      onSuccess: () => {
        emailForm.reset()
      },
    })
  }

  const onPasswordSubmit = (data: UpdatePasswordPayload) => {
    passwordMutation.mutate(data, {
      onSuccess: () => {
        passwordForm.reset()
      },
    })
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and security preferences.</p>
      </div>

      {/* Change Email */}
      <Card className="mb-6 border-border/40 bg-card">
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
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.newEmail.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={emailMutation.isPending || !emailForm.formState.isDirty}
            >
              {emailMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update Email"
              )}
            </Button>
          </form>
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
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
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
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
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
                <p className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={passwordMutation.isPending || !passwordForm.formState.isDirty}
            >
              {passwordMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
