import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';  // Import Trash icon
import { AddChemicalDialog } from "./AddChemicalDialog";
import { useGetCustomerByIdQuery, useRemoveChemicalFromCustomerMutation } from '@/slice/customerSlice/customerApiSlice';

export const ChemicalsDialog = ({ 
  customerId, 
  customerName, 
  open, 
  onOpenChange,
  customerRefatch
}) => {
  const [showAddChemical, setShowAddChemical] = useState(false);
  
  // Fetch customer data including chemicals
  const { 
    data: customerResponse, 
    isLoading, 
    isError,
    refetch
  } = useGetCustomerByIdQuery(customerId, {
    // Only fetch when the dialog is open
    skip: !open
  });

  // Use mutation for deleting chemical
  const [deleteChemical, { isLoading: isDeleting }] = useRemoveChemicalFromCustomerMutation();

  // Handle adding a new chemical
  const handleAddChemical = (newChemical) => {
    // Implement your add chemical logic here
    console.log('Adding chemical:', newChemical);
    setShowAddChemical(false);
  };

  // Handle deleting a chemical
  const handleDeleteChemical = async (chemicalId) => {
    try {
      await deleteChemical({ customerId, chemicalId });  // Call delete mutation
      refetch();  // Refetch customer data to update the list of chemicals
    } catch (error) {
      console.error('Error deleting chemical:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Chemicals...</DialogTitle>
          </DialogHeader>
          <p>Fetching chemical data...</p>
        </DialogContent>
      </Dialog>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Loading Chemicals</DialogTitle>
          </DialogHeader>
          <p>Unable to fetch chemical data. Please try again.</p>
        </DialogContent>
      </Dialog>
    );
  }

  // Destructure chemicalId from the response data
  const chemicals = customerResponse?.data?.chemicalId || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Chemicals for {customerName}</DialogTitle>
              <Button className="m-3" onClick={() => setShowAddChemical(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Chemical
              </Button>
            </div>
          </DialogHeader>
          
          {chemicals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>CAS Number</TableHead>
                  <TableHead>Actions</TableHead> {/* Add Actions column */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {chemicals.map((chemical) => (
                  <TableRow key={chemical._id}>
                    <TableCell>{chemical.name}</TableCell>
                    <TableCell>{chemical.cas_number}</TableCell>
                    <TableCell>
                      {/* Delete button for each chemical */}
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteChemical(chemical._id)} 
                        disabled={isDeleting}
                      >
                        <Trash />
                      
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4">No chemicals found for this customer</p>
          )}
        </DialogContent>
      </Dialog>

      <AddChemicalDialog 
        open={showAddChemical} 
        onOpenChange={setShowAddChemical}
        customerId={customerId}
        onAddChemical={handleAddChemical}
        customerRefatch={customerRefatch}
        refetch={refetch}
      />
    </>
  );
};
