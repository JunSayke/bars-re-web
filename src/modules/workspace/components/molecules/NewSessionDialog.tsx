import { useForm } from "react-hook-form"
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
import { cn } from "@/shared/lib/utils"
import { createSessionPayloadSchema } from "../../schemas/workspace.schema"
import { useCreateSessionMutation } from "../../hooks/useCreateSessionMutation"
import type { CreateSessionPayload } from "../../schemas/workspace.schema"

interface NewSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewSessionDialog({ open, onOpenChange }: NewSessionDialogProps) {
  const mutation = useCreateSessionMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSessionPayload>({
    resolver: zodResolver(createSessionPayloadSchema),
    defaultValues: { title: "", topic: "" },
  })

  function onSubmit(data: CreateSessionPayload) {
    mutation.mutate(data, {
      onSuccess: () => {
        reset()
        onOpenChange(false)
      },
    })
  }

  function handleClose() {
    if (!mutation.isPending) {
      reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Rap Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <label
              htmlFor="session-title"
              className="text-xs font-semibold uppercase tracking-widest text-foreground"
            >
              SESSION TITLE <span className="text-destructive">*</span>
            </label>
            <Input
              id="session-title"
              placeholder="Enter a title"
              aria-invalid={!!errors.title}
              disabled={mutation.isPending}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="session-topic"
              className="text-xs font-semibold uppercase tracking-widest text-foreground"
            >
              TOPIC OR IDEA{" "}
              <span className="font-normal italic normal-case tracking-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id="session-topic"
              rows={3}
              placeholder="What's the song about?"
              className={cn(
                "w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
                "placeholder:text-muted-foreground resize-none md:text-sm dark:bg-input/30",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              )}
              {...register("topic")}
              disabled={mutation.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "CREATE SESSION"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
