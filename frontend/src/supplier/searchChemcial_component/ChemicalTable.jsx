import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function ChemicalTable({ chemicals, onRemoveChemical }) {
  const [page, setPage] = React.useState(1)
  const [itemsPerPage, setItemsPerPage] = React.useState(10)
  const [chemicalFilter, setChemicalFilter] = React.useState('')
  const [casFilter, setCasFilter] = React.useState('')

  const handleRemoveChemical = async (chemical) => {
    if (chemicals) {
      onRemoveChemical(chemical)
    }
  }

  // Filter chemicals based on the search input
  const filteredChemicals = chemicals.filter(
    (chemical) =>
      chemical.name.toLowerCase().includes(chemicalFilter.toLowerCase()) &&
      chemical.cas_number.toLowerCase().includes(casFilter.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredChemicals.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentChemicals = filteredChemicals.slice(startIndex, endIndex)

  return (
    <div className="border rounded-md mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Chemical Name</TableHead>
            <TableHead>CAS Number</TableHead>
          </TableRow>
          <TableRow>
            <TableCell>
              <input
                type="text"
                placeholder="Filter by Chemical Name"
                value={chemicalFilter}
                onChange={(e) => setChemicalFilter(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                placeholder="Filter by CAS Number"
                value={casFilter}
                onChange={(e) => setCasFilter(e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentChemicals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                No chemicals found.
              </TableCell>
            </TableRow>
          ) : (
            currentChemicals.map((chemical) => (
              <TableRow key={chemical._id}>
                <TableCell>{chemical.name}</TableCell>
                <TableCell>{chemical.cas_number}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          Items per page:{' '}
          <select
            className="border rounded"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {startIndex + 1} - {Math.min(endIndex, filteredChemicals.length)} of{' '}
              {filteredChemicals.length}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
