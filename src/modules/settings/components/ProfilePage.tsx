"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useProfileQuery } from "../hooks/useProfileQuery"
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation"
import { updateProfilePayloadSchema } from "../schemas/settings.schema"
import type { UpdateProfilePayload } from "../types/settings.types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function ProfilePage() {
  const { profile, isLoading, isError } = useProfileQuery()
  const updateMutation = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfilePayloadSchema),
    defaultValues: { displayName: "", avatarUrl: null },
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

  const onSubmit = (data: UpdateProfilePayload) => {
    updateMutation.mutate(data, {
      onSuccess: (updated) => {
        reset({
          displayName: updated.displayName,
          avatarUrl: updated.avatarUrl,
        })
      },
    })
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-secondary/60" />
          <div className="h-10 rounded bg-secondary/60" />
          <div className="h-10 rounded bg-secondary/60" />
          <div className="h-10 rounded bg-secondary/60" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
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
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-8">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email ?? ""}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            Email is managed through your account settings.
          </p>
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
          <p className="text-xs text-muted-foreground">
            Paste a link to your avatar image.
          </p>
        </div>

        <Button
          type="submit"
          disabled={updateMutation.isPending || !isDirty}
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  )
}
