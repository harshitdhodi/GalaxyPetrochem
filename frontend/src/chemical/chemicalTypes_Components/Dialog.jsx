import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function ChemicalTypesDialog({ open, setOpen, chemicalName, setChemicalName, handleSave }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-purple-600">Manage Chemical Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Chemical Type Name"
              value={chemicalName}
              onChange={(e) => setChemicalName(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
            {!chemicalName && <p className="text-red-500 text-sm">Please enter name</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSave}
              disabled={!chemicalName}
              className="bg-green-500 hover:bg-green-600"
            >
              Save
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
