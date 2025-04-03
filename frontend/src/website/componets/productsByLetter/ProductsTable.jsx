import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AlphabetbaseProductTable = ({ chemicals }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate(); // Initialize navigate function

  if (!chemicals || chemicals.length === 0) {
    return <div className="p-4 text-center">No products found.</div>;
  }

  // Calculate pagination values
  const totalItems = chemicals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedChemicals = chemicals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNameClick = (name) => {
    const formattedName = name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
    console.log(`Redirecting to: /${formattedName}`);
    navigate(`/${formattedName}`); // Redirect to the dynamic route
  };
  

  return (
    <div>
      <Table >
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Product Code</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>CAS</TableHead>
            {/* <TableHead>Grade</TableHead>
            <TableHead>Molecular Formula</TableHead> */}
            <TableHead>TDS</TableHead>
            <TableHead>MSDS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedChemicals.map((chemical) => (
            <TableRow key={chemical.auto_p_code}>
              <TableCell>{chemical.auto_p_code}</TableCell>
              <TableCell>
                <button
                  className="text-main hover:no-underline"
                  onClick={() => handleNameClick(chemical.name)}
                >
                  {chemical.name}
                </button>
              </TableCell>
              <TableCell>{chemical.cas_number}</TableCell>
              {/* <TableCell>{chemical.grade}</TableCell>
              <TableCell>{chemical.molecular_formula}</TableCell> */}
              <TableCell>Specs</TableCell>
              <TableCell>MSDS</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <nav className="flex space-x-1" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "outline" : "default"}
              size="sm"
              className={`min-w-[40px] ${
                page === currentPage
                  ? "bg-main text-white hover:bg-main_light"
                  : "hover:bg-blue-50"
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AlphabetbaseProductTable;
