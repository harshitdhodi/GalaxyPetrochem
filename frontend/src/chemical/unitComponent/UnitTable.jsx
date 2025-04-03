// components/UnitTable.js
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react'

export default function UnitTable({ units, openEditDialog, handleDelete }) {
  return (
    <div className="w-full max-w-4xl border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Action</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openEditDialog(unit)}
                    className="bg-green-500 hover:bg-green-600"
                    size="sm"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(unit._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
              <TableCell>{unit.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
