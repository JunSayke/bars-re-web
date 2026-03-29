"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { beatLinkUrlSchema } from "../../schemas/workspace.schema"

const formSchema = z.object({ url: beatLinkUrlSchema })
type FormValues = z.infer<typeof formSchema>

interface BeatLinkFormProps {
  defaultUrl?: string
  isPending?: boolean
  onSubmit: (url: string) => void
}

export function BeatLinkForm({ defaultUrl = "", isPending = false, onSubmit }: BeatLinkFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { url: defaultUrl },
  })

  function onValid(data: FormValues) {
    onSubmit(data.url)
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          {...register("url")}
          placeholder="Paste a Spotify, YouTube, or SoundCloud link"
          className="flex-1 text-sm"
          aria-label="Beat link URL"
          autoComplete="off"
          spellCheck={false}
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : "Embed"}
        </Button>
      </div>
      {errors.url && (
        <p className="text-xs text-destructive" role="alert">
          {errors.url.message}
        </p>
      )}
    </form>
  )
}
