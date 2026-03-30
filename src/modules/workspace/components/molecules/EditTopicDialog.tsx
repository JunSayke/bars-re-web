import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditTopicDialogProps {
  open: boolean
  initialTopic: string
  onClose: () => void
  onConfirm: (newTopic: string) => void
}

// Rendered with key={sessionId} by parent so state re-initializes on each open.
export function EditTopicDialog({
  open,
  initialTopic,
  onClose,
  onConfirm,
}: EditTopicDialogProps) {
  const [value, setValue] = useState(initialTopic)

  function handleSave() {
    onConfirm(value.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Topic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="topic-input">Topic / Idea</Label>
          <Input
            id="topic-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="e.g. hustle, love, street life"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
