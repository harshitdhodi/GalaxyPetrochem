import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, EllipsisVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom'; // For redirection
import AddChemicalModal from './AddChemicalModel';
import { useDeleteSupplierMutation, useGetSuppliersQuery } from '@/slice/supplierSlice/SupplierSlice';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ChemicalTable from '../ChemicalTable';

const SuppliersTable = () => {
    const { data: suppliers = [], isLoading, error } = useGetSuppliersQuery();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
    const [showAddChemicalModal, setShowAddChemicalModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        mobile: '',
        country: '',
        website: ''
    });
    const navigate = useNavigate();
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [showChemicalTable, setShowChemicalTable] = useState(false);
    const { refetch } = useGetSuppliersQuery();

    const [deleteSupplier] = useDeleteSupplierMutation();

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Filtered and Paginated Data
    const filteredData = suppliers.filter(supplier => {
        const searchTerm = filters.name.toLowerCase();
        return (
            (!filters.name || 
                supplier.name.toLowerCase().includes(searchTerm) ||
                supplier.email.toLowerCase().includes(searchTerm) ||
                supplier.mobile.toLowerCase().includes(searchTerm)
            ) &&
            (!filters.country || supplier.country.toLowerCase().includes(filters.country.toLowerCase())) &&
            (!filters.website || supplier.website.toLowerCase().includes(filters.website.toLowerCase()))
        );
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id) => {
        try {
            await deleteSupplier(id);
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to the first page
    };

    const handleAddChemical = (supplier) => {
        setCurrentSupplier(supplier);
        setShowAddChemicalModal(true);
    };

    const handleChemicalsClick = (supplier) => {
        setSelectedSupplier(supplier);
        setShowChemicalTable(true);
    };

    // Add loading state handling
    if (isLoading) {
        return <div>Loading...</div>
    }

    // Add error state handling
    if (error) {
        return <div>Error loading suppliers: {error.message}</div>
    }

    return (
        <div>
            <div className="rounded-md shadow-sm bg-white">
                <Table className="w-full text-left border-collapse">
                    <TableHeader className="bg-gray-100 border-b border-gray-300">
                        <TableRow className="text-gray-600 font-semibold">
                            <TableHead className="w-10"></TableHead>
                            <TableHead>Info</TableHead>
                            <TableHead>Chemicals</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Website</TableHead>
                        </TableRow>
                        <TableRow className="bg-gray-50">
                            <TableCell></TableCell>
                            <TableCell>
                                <input
                                    type="text"
                                    placeholder="Filter by name, email or mobile"
                                    className="p-2 rounded w-full border border-gray-300"
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                />
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <input
                                    type="text"
                                    placeholder="Filter by country"
                                    className="p-2 rounded w-full border border-gray-300"
                                    value={filters.country}
                                    onChange={(e) => handleFilterChange('country', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <input
                                    type="text"
                                    placeholder="Filter by website"
                                    className="p-2 rounded w-full border border-gray-300"
                                    value={filters.website}
                                    onChange={(e) => handleFilterChange('website', e.target.value)}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedData.map((supplier) => (
                            <React.Fragment key={supplier._id}>
                                <TableRow className="hover:bg-gray-50 border-b border-gray-300">
                                    <TableCell className="p-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className='p-3'>
                                                    <EllipsisVertical className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleAddChemical(supplier)}>
                                                    Add Chemical
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => navigate(`/edit-supplier-form/${supplier._id}`)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(supplier._id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{supplier.name}</span>
                                            <span className="text-sm text-gray-600">{supplier.email}</span>
                                            <span className="text-sm text-gray-600">{supplier.mobile}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleChemicalsClick(supplier)}
                                            className="bg-[#3b1f91] text-white px-4 py-2 rounded hover:bg-[#3b1f91] transition-colors duration-300"
                                        >
                                            Chemicals
                                            <Badge
                                                variant="secondary"
                                                className="ml-2 bg-gray-200 text-black px-2 py-1 rounded"
                                            >
                                                {supplier.totalChemicalIds || 0}
                                            </Badge>
                                        </Button>
                                    </TableCell>
                                    <TableCell>{supplier.country}</TableCell>
                                    <TableCell>
                                        <Link
                                            to={supplier.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {supplier.website}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <label htmlFor="items-per-page" className="mr-2">
                        Items per page:
                    </label>
                    <select
                        id="items-per-page"
                        className="p-2  border border-gray-300 rounded"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border border-gray-300 rounded mr-2"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 border border-gray-300 rounded ml-2"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {showAddChemicalModal && (
                <AddChemicalModal
                    open={showAddChemicalModal}
                    onClose={() => setShowAddChemicalModal(false)}
                    supplier={currentSupplier}
                    supplierId={currentSupplier?._id}
                    chemicalName={currentSupplier?.name}
                />
            )}

            <Dialog open={showChemicalTable} onOpenChange={setShowChemicalTable}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    {showChemicalTable && selectedSupplier && (
                        <ChemicalTable 
                            supplier={selectedSupplier._id}
                            supplierName={selectedSupplier.name}
                            allData={refetch}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SuppliersTable;
