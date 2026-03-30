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
            <Input
              id="session-topic"
              placeholder="What's the song about?"
              disabled={mutation.isPending}
              {...register("topic")}
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
