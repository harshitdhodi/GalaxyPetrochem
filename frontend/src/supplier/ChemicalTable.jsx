import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { useCountAllChemicalsQuery } from "@/slice/supplierSlice/chemicalBySupplier";
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddChemicalModal from './supplierTable/AddChemicalModel';
import { useDeleteChemicalFromSupplierMutation } from "@/slice/supplierSlice/SupplierSlice"; // Import mutation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ChemicalTable({ supplier, supplierName ,allData  }) {
  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddChemicalModal, setShowAddChemicalModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState(null); // Track the selected chemical
  const [modalType, setModalType] = useState(null); // New state to track modal type
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [chemicalToDelete, setChemicalToDelete] = useState(null);

  // Fetch chemicals using the supplierId
  const { data, isLoading, isError ,refetch } = useCountAllChemicalsQuery(supplier, {
    skip: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  // Mutation hook for deleting a chemical
  const [deleteChemicalFromSupplier, { isLoading: isDeleting }] = useDeleteChemicalFromSupplierMutation();

  useEffect(() => {
    if (data) {
      // Calculate the total pages based on the length of the chemicals array
      setTotalPages(Math.ceil(data.chemicals.length / itemsPerPage));
    }
  }, [data, itemsPerPage]);

  const handleAddChemicalClick = (chemical) => {
    setSelectedChemical(chemical);  // Set the selected chemical
    setShowAddChemicalModal(true);  // Open the modal
    setModalType('supplier');       // Set modal type to 'supplier'
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleDeleteClick = (chemical) => {
    setChemicalToDelete(chemical);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteChemicalFromSupplier({ 
        supplierId: supplier, 
        chemicalId: chemicalToDelete._id 
      }).unwrap();
      refetch();
    } catch (err) {
      console.error("Error deleting chemical:", err);
    } finally {
      setShowDeleteConfirmation(false);
      setChemicalToDelete(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading chemicals</div>;

  // Ensure the chemicals are mapped from the correct data source
  const chemicals = Array.isArray(data?.chemicals) ? data.chemicals : [];

  return (
    <div className="w-full overflow-auto">
      <DialogHeader>
        <div className="flex justify-between items-center mr-5">
          <DialogTitle>
            Chemicals for {supplierName}
          </DialogTitle>
          <Button onClick={() => handleAddChemicalClick(chemicals)} className="bg-purple-600 hover:bg-purple-700">
            + Add Chemical
          </Button>
        </div>
      </DialogHeader>

      <div className="mt-5 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-2">Name</TableHead>
              <TableHead className="p-2">CAS Number</TableHead>
              <TableHead className="p-2 w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chemicals.map((chemical, index) => (
              <TableRow key={index} className="p-2">
                <TableCell className="px-2 py-1">{chemical.name}</TableCell>
                <TableCell className="px-2 py-1">{chemical.cas_number}</TableCell>
                <TableCell className="px-2 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDeleteClick(chemical)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : <Trash2 className="h-4 w-4" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Render the Add Supplier Modal if open */}
      {showAddChemicalModal && selectedChemical && (
        <AddChemicalModal
          open={showAddChemicalModal}
          onClose={() => setShowAddChemicalModal(false)}
          chemicalName={selectedChemical.name}
          supplier={supplierName}
          supplierId={supplier}
          refetch={refetch}
          allData={allData}
        />
      )}

      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the chemical
              {chemicalToDelete && ` "${chemicalToDelete.name}"`} from this supplier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            className="border p-1 rounded"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>{currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
