import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetSuppliersByChemicalIdQuery } from '@/slice/supplierSlice/SupplierSlice';

export function SupplierTable({ selectedChemicalIds, onRemoveChemical }) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({ name: '', email: '', mobile: '' });

  const { data: suppliers, error, isLoading } = useGetSuppliersByChemicalIdQuery(selectedChemicalIds);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredSuppliers = suppliers
    ? suppliers.filter((supplier) =>
        Object.entries(filters).every(
          ([key, value]) =>
            supplier[key]?.toString().toLowerCase().includes(value.toLowerCase())
        )
      )
    : [];

  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  return (
    <div className="border rounded-md mt-4">
      <Table>
        {/* Table Headers */}
        <TableHeader  className="bg-gray-200">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
          </TableRow>
        </TableHeader>

        {/* Filter Row */}
        <TableBody>
          <TableRow>
            <TableCell>
              <input
                type="text"
                name="name"
                placeholder="Filter by Name"
                value={filters.name}
                onChange={handleFilterChange}
                className="border rounded w-full px-2 py-1"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                name="email"
                placeholder="Filter by Email"
                value={filters.email}
                onChange={handleFilterChange}
                className="border rounded w-full px-2 py-1"
              />
            </TableCell>
            <TableCell>
              <input
                type="text"
                name="mobile"
                placeholder="Filter by Mobile"
                value={filters.mobile}
                onChange={handleFilterChange}
                className="border rounded w-full px-2 py-1"
              />
            </TableCell>
          </TableRow>

          {/* Loading, Error, and No Data States */}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3}>Loading suppliers...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={3} className="text-red-500">
                 {error.message}
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !error && currentSuppliers.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>No suppliers available.</TableCell>
            </TableRow>
          )}

          {/* Display Filtered Suppliers */}
          {currentSuppliers.map((supplier) => (
            <TableRow key={supplier._id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.mobile}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-sm text-gray-500">
          Items per page:
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
          <Button className="" variant="secondary" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            {startIndex + 1} - {Math.min(endIndex, filteredSuppliers.length)} of {filteredSuppliers.length}
          </span>
          <Button variant="secondary" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
