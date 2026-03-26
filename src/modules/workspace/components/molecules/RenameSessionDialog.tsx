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

interface RenameSessionDialogProps {
  open: boolean
  initialTitle: string
  onClose: () => void
  onConfirm: (newTitle: string) => void
}

// Rendered with key={sessionId} by parent so state re-initializes on each open.
export function RenameSessionDialog({
  open,
  initialTitle,
  onClose,
  onConfirm,
}: RenameSessionDialogProps) {
  const [value, setValue] = useState(initialTitle)

  function handleSave() {
    if (!value.trim()) return
    onConfirm(value.trim())
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="rename-input">Title</Label>
          <Input
            id="rename-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          {!value.trim() && (
            <p className="text-xs text-destructive">Title cannot be empty.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!value.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
