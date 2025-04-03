import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddChemicalIdsToSupplierMutation, useGetChemicalsByAlphabetQuery } from "@/slice/supplierSlice/chemicalBySupplier"; // Adjust the import path

const AddChemicalModal = ({ open, onClose, chemicalName, supplier, supplierId, refetch ,allData }) => {
 
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedChemicals, setSelectedChemicals] = useState([]); // Store selected chemicals

  // Fetch chemicals based on the search query
  const { data: chemicals, isLoading, error } = useGetChemicalsByAlphabetQuery(
    supplierSearch,
    { skip: !supplierSearch || supplierSearch.length < 2 }
  );

  // Mutation hook to add chemical IDs to supplier
  const [addChemicalIdsToSupplier, { isLoading: isAdding }] = useAddChemicalIdsToSupplierMutation();

  const handleAddSupplier = async () => {
    const chemicalIds = selectedChemicals.map((chemical) => chemical._id);

    try {
      // Pass the supplierId and the list of selected chemical IDs to the mutation
      await addChemicalIdsToSupplier({ supplierId, chemical_ids: chemicalIds }).unwrap();
      await refetch(); // Refetch the suppliers data
      onClose(); // Close the modal
      allData()
    } catch (err) {
      console.error("Error adding chemicals:", err);
    }
  };

  const handleSelectChemical = (chemical) => {
    // Add the selected chemical to the list and update the state immediately
    setSelectedChemicals((prevSelected) => {
      const updatedSelected = [...prevSelected, chemical];
      setSupplierSearch(""); // Clear the search input after selection
      return updatedSelected;
    });
  };

  const handleRemoveChemical = (chemicalId) => {
    // Remove the selected chemical from the list
    setSelectedChemicals((prevSelected) =>
      prevSelected.filter((chemical) => chemical._id !== chemicalId)
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#3b1f91]">
            Add Chemicals for {supplier}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder={`Search ${supplier}`}
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
                {chemicals.map((chemical) => (
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

          {/* Show selected chemicals in input fields */}
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
              onClick={handleAddSupplier}
              className="bg-[#3b1f91] hover:bg-purple-700"
              disabled={isAdding || selectedChemicals.length === 0}
            >
              {isAdding ? "Adding..." : "+ Add"}
            </Button>
            <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddChemicalModal;
