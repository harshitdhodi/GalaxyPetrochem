import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export default function ChemicalTypesTable({ chemicalTypes, handleEdit, handleDelete }) {
  return (
    <Table className="w-1/2 border">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="w-[200px] border-r font-bold  border-gray-300">Action</TableHead>
          <TableHead className="font-bold">Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {chemicalTypes.map((type) => (
          <TableRow key={type.id} className="p-1">
            <TableCell className="p-2 border-r border-gray-300">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-green-500 px-2 py-1 hover:bg-green-600 w-20 text-white border-none"
                  size="sm"
                  onClick={() => handleEdit(type)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 hover:bg-red-600 w-20 text-white border-none"
                  size="sm"
                  onClick={() => handleDelete(type._id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
            <TableCell className="p-2">{type.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
