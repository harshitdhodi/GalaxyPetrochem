// components/UnitDialog.js
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UnitDialog({
  isOpen,
  onOpenChange,
  unitName,
  setUnitName,
  handleSubmit,
  title
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Unit Name</Label>
            <Input
              id="name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="Enter unit name"
            />
          </div>
          <Button onClick={handleSubmit}>{title}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
