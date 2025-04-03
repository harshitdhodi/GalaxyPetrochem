import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddChemicalIdsToSupplierMutation } from "@/slice/supplierSlice/chemicalBySupplier";
import { useAddChemicalToCustomerMutation } from "@/slice/customerSlice/customerApiSlice";

const AddSupplierModal = ({ refetch, open, onClose, chemicalName,fetchChemicals, chemicalId, supplier, onAddSupplier = [] }) => {
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Reset the input field when the modal opens
  useEffect(() => {
    if (open) {
      setSupplierSearch("");
      setSelectedSupplier(null);
    }
  }, [open]);

  // Conditionally choose the mutation hook based on the supplier value
  const [addChemical, { isLoading }] = supplier === 'Supplier'
    ? useAddChemicalIdsToSupplierMutation()
    : useAddChemicalToCustomerMutation();

  // Filter suggestions based on the input
  const filteredSuppliers = Array.isArray(onAddSupplier)
    ? onAddSupplier.filter((sup) =>
      sup.name?.toLowerCase().includes(supplierSearch.toLowerCase())
    )
    : [];

  const handleAddSupplier = async () => {
    if (!selectedSupplier) {
      console.log("No supplier or customer selected");
      return;
    }
    try {
      let response;
      if (supplier === 'Supplier') {
        response = await addChemical({
          chemical_ids: [chemicalName._id],
          supplierId: selectedSupplier._id,
        }).unwrap();
      } else {
        response = await addChemical({
          chemicalId: [chemicalName._id],
          customerId: selectedSupplier._id,
        }).unwrap();
      }

      console.log(`${supplier} ${selectedSupplier.name} added to ${chemicalName.name}`);
      await refetch();
      fetchChemicals();
      onClose();
      
    } catch (error) {
      console.error(`Failed to add ${supplier.toLowerCase()}:`, error);
      alert(`Failed to add ${supplier.toLowerCase()}. Please try again.`);
    }
  };

  const handleSuggestionClick = (sup) => {
    setSelectedSupplier(sup);
    setSupplierSearch(sup.name);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#3b1f91]">
            Add {supplier} for {chemicalName.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder={`Search ${supplier}`}
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            className="w-full mb-2"
          />
          {supplierSearch && !selectedSupplier && (
            <div className="bg-white border border-gray-300 rounded shadow max-h-40 overflow-y-auto">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((sup) => (
                  <div
                    key={sup.id}
                    onClick={() => handleSuggestionClick(sup)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {sup.name}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500">No matching {supplier.toLowerCase()}s</div>
              )}
            </div>
          )}
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleAddSupplier}
              className="bg-[#3b1f91] hover:bg-purple-700"
              disabled={isLoading || !selectedSupplier}
            >
              {isLoading ? "Adding..." : "+ Add"}
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

export default AddSupplierModal;
