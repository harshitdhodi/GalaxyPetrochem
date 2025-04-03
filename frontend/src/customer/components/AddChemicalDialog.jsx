import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGetChemicalsByAlphabetQuery } from '@/slice/supplierSlice/chemicalBySupplier'
import axios from 'axios'

export const AddChemicalDialog = ({ 
    open, 
    onOpenChange, 
    customerId, // Add customer ID as a prop
    onAddChemical ,
    customerRefatch,
    refetch
}) => {
    const [supplierSearch, setSupplierSearch] = useState("");
    const [selectedChemicals, setSelectedChemicals] = useState([]); // Store selected chemicals
  
    // Fetch chemicals based on the search query
    const { data: chemicals, isLoading, error } = useGetChemicalsByAlphabetQuery(
        supplierSearch,
        { skip: !supplierSearch || supplierSearch.length < 2 }
    );

    const handleAddChemical = async () => {
        // Ensure we're using the chemical ID array
        const chemicalIds = selectedChemicals.map((chemical) => chemical._id);
  
        const requestData = {
            id: customerId, // Include customer ID in the request
            chemicalId: chemicalIds // Match the exact key expected by backend
        };
  
        try {
            // Sending request to add chemicals
            await axios.put(`/api/customer/addChemicalIdsToCustomer?id=${customerId}`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
  
            onOpenChange(false);  // Close the modal
            if (onAddChemical) onAddChemical(selectedChemicals); // Optional callback
            customerRefatch();
            refetch();
        } catch (err) {
            console.error("Error adding chemicals:", err);
            // Optionally handle error (show toast, alert, etc.)
        }
    };
  
    const handleSelectChemical = (chemical) => {
        // Prevent adding duplicate chemicals
        if (!selectedChemicals.some(selected => selected._id === chemical._id)) {
            setSelectedChemicals((prevSelected) => {
                const updatedSelected = [...prevSelected, chemical];
                setSupplierSearch(""); // Clear the search input after selection
                return updatedSelected;
            });
        }
    };

    const handleRemoveChemical = (chemicalId) => {
        // Remove the selected chemical from the list
        setSelectedChemicals((prevSelected) => 
            prevSelected.filter((chemical) => chemical._id !== chemicalId)
        );
        refetch();
    };
  
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
            <DialogContent className="max-w-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-[#3b1f91]">
                        Add Chemicals to Customer
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Input
                        placeholder="Search chemicals"
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="w-full mb-4"
                    />

                    {/* Dynamic Dropdown for Chemical Suggestions */}
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        supplierSearch &&
                        chemicals &&
                        chemicals.length > 0 && (
                            <ul className="border bg-white rounded max-h-40 overflow-y-auto">
                                {chemicals
                                    .filter(chemical => 
                                        !selectedChemicals.some(selected => selected._id === chemical._id)
                                    )
                                    .map((chemical) => (
                                    <li
                                        key={chemical._id}
                                        onClick={() => handleSelectChemical(chemical)}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {chemical.name}
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                    {chemicals?.length === 0 && !isLoading && supplierSearch && (
                        <div className="p-2 text-gray-500">No chemicals found</div>
                    )}

                    {/* Show selected chemicals */}
                    <div className="mt-4">
                        {selectedChemicals.length > 0 && (
                            <div className="space-y-2">
                                {selectedChemicals.map((chemical) => (
                                    <div
                                        key={chemical._id}
                                        className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                    >
                                        <span>{chemical.name}</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveChemical(chemical._id)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button
                            onClick={handleAddChemical}
                            className="bg-[#3b1f91] hover:bg-purple-700"
                            disabled={selectedChemicals.length === 0}
                        >
                            + Add Chemicals
                        </Button>
                        <Button 
                            onClick={() => onOpenChange(false)} 
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddChemicalDialog;