import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell, 
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductTable = ({ chemicals,slug, isLoading, msds, specs, error }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  console.log(chemicals);
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error fetching chemicals: {error}
      </div>
    );
  }

  if (chemicals.length === 0) {
    return <div className="p-4 text-center">No products found.</div>;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chemicals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(chemicals.length / itemsPerPage);
console.log(currentItems)
  const handleNameClick = (name) => {
    console.log(slug)
    const formattedName = name.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
    console.log(`Redirecting to: /${formattedName}`);
    navigate(`/${slug}/${formattedName}`); // Redirect to the dynamic route
  };

  const handleSpecsClick = (specs) => {
    if (specs) {
      // Open catalog URL in new tab
      window.open(`/api/image/specs/view/${specs}`, '_blank');
    }
  };

  const handleMsdsClick = (msds) => {
    if (msds) {
      // Open catalog URL in new tab
      window.open(`/api/image/msds/view/${msds}`, '_blank');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="flex flex-col md:pr-5 md:ml-5 xl:ml-0 lg:pr-0 gap-4">
      <div className="flex sm:flex-row flex-col sm:justify-between xl:mr-0 lg:mr-5 sm:items-center bg-blue-100 gap-2 sm:gap-0 px-4 py-1 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-main font-medium">Items per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-[60px] bg-white border-gray-200 hover:border-gray-300">
              <SelectValue /> 
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 30, 40, 50].map((value) => (
                <SelectItem key={value} className="w-[60px]" value={value.toString()}>
                  <span className='text-main text-md font-medium'>{value}</span>
                </SelectItem>
              ))} 
            </SelectContent>
          </Select>
        </div>
        <div className="text-main font-medium">
          Showing <span className="text-gray-900">{indexOfFirstItem + 1}</span> to <span className="text-gray-900">{Math.min(indexOfLastItem, chemicals.length)}</span> of <span className="text-gray-900">{chemicals.length}</span> items
        </div>
      </div>

      <div className='lg:mr-5 xl:mr-0'>
      <Table>
        <TableHeader>
          <TableRow className="bg-main hover:bg-main_light">
            <TableHead className="text-white text-center">Index No</TableHead>
            <TableHead className="text-white">Product Name</TableHead>
            <TableHead className="text-white text-center">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((chemical, index) => (
            <TableRow
              key={chemical.auto_p_code}
              className={index % 2 !== 0 ? 'bg-main/20 hover:bg-main/10' : ''}
            >
            <TableCell className="text-center text-main">{indexOfFirstItem + index + 1}</TableCell>

              <TableCell className="text-main">
                <button
                  className="text-main hover:no-underline"
                  onClick={() => handleNameClick(chemical.slug)}
                >
                  {chemical.name}
                </button>
              </TableCell>
              <TableCell className="text-main text-center">₹{chemical.price}/Piece</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>

      <div className="flex flex-wrap justify-end lg:mr-5 xl:mr-0 gap-1.5">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border rounded-md transition-colors duration-200 ${
              currentPage === index + 1 
                ? 'bg-main_light text-white border-main hover:bg-main' 
                : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

ProductTable.propTypes = {
  chemicals: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default ProductTable;
