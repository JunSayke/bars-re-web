import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { createSnippetPayloadSchema } from "../../schemas/snippet.schema"
import { SnippetWordCount } from "../atoms/SnippetWordCount"
import type { CreateSnippetPayload, SnippetTag } from "../../types/snippet.types"

const SNIPPET_TAGS: SnippetTag[] = ["Chorus", "Verse", "Hook", "Freestyle", "Bridge"]
const MAX_WORDS = 200

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

interface SnippetFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<CreateSnippetPayload>
  onSubmit: (data: CreateSnippetPayload) => void
  isPending?: boolean
}

export function SnippetFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending = false,
}: SnippetFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSnippetPayload>({
    resolver: zodResolver(createSnippetPayloadSchema),
    defaultValues: { title: "", content: "", tags: [], ...defaultValues },
  })

  useEffect(() => {
    if (open) {
      reset({ title: "", content: "", tags: [], ...defaultValues })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const contentValue = watch("content") ?? ""
  const wordCount = countWords(contentValue)
  const isOverLimit = wordCount > MAX_WORDS

  function handleClose() {
    if (!isPending) {
      reset()
      onOpenChange(false)
    }
  }

  function onValidSubmit(data: CreateSnippetPayload) {
    if (isOverLimit) return
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultValues?.title ? "Edit Snippet" : "New Snippet"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onValidSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <label
              htmlFor="snippet-title"
              className="text-xs font-semibold uppercase tracking-widest text-foreground"
            >
              TITLE <span className="text-destructive">*</span>
            </label>
            <Input
              id="snippet-title"
              placeholder="Snippet title"
              aria-invalid={!!errors.title}
              disabled={isPending}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="snippet-content"
                className="text-xs font-semibold uppercase tracking-widest text-foreground"
              >
                CONTENT <span className="text-destructive">*</span>
              </label>
              <SnippetWordCount count={wordCount} />
            </div>
            <textarea
              id="snippet-content"
              placeholder="Write your bars or lyric fragments…"
              rows={6}
              disabled={isPending}
              aria-invalid={!!errors.content}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              {...register("content")}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content.message}</p>
            )}
            {isOverLimit && (
              <p className="text-xs text-destructive">
                Snippet exceeds the maximum limit of 200 words. ({wordCount} words).
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-widest text-foreground">
              TAGS
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-3">
                  {SNIPPET_TAGS.map((tag) => (
                    <label key={tag} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={field.value?.includes(tag) ?? false}
                        onCheckedChange={(checked) => {
                          const current = field.value ?? []
                          field.onChange(
                            checked
                              ? [...current, tag]
                              : current.filter((t) => t !== tag)
                          )
                        }}
                        disabled={isPending}
                      />
                      <span className="text-sm">{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isOverLimit}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
