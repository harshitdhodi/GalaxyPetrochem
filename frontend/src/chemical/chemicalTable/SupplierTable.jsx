import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import SupplierForm from "../SupplierForm";
import EmailForm from "../EmailForm";
import { ChemicalContext } from "../ChemicalContext";
import AddSupplierModal from "./AddSupplierModel";
import {
  useDeleteChemicalFromSupplierMutation,
  useGetSuppliersByChemicalIdQuery,
  useGetSuppliersQuery,
} from "@/slice/supplierSlice/SupplierSlice";
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

export default function SuppliersTable({ chemicalName, supplier,fetchChemicals, chemicalId }) {
  console.log(chemicalId)
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const { selectedItem } = useContext(ChemicalContext);

  const { data: suppliers = [], isLoading, error ,refetch } = useGetSuppliersByChemicalIdQuery(chemicalId);
  const { data: allSupplier } = useGetSuppliersQuery();
  const [deleteChemical, { isLoading: isDeleting }] = useDeleteChemicalFromSupplierMutation();

  const countries = ["Pakistan", "India", "USA", "Canada", "Australia"];

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    supplier.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
    supplier.mobile.toLowerCase().includes(mobileFilter.toLowerCase()) &&
    supplier.country.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const handleSupplierSelect = (supplierId) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleDeleteClick = (supplierId) => {
    setSupplierToDelete(supplierId);
  };

  const handleConfirmDelete = async () => {
    if (supplierToDelete) {
      try {
        await deleteChemical({ supplierId: supplierToDelete, chemicalId }).unwrap();
        refetch();
    
      } catch (error) {
        console.error('Failed to delete chemical:', error);
        alert('Failed to delete chemical');
      }
    }
    setSupplierToDelete(null);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Table Header and Add Supplier Modal */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#3b1f91]">
          {supplier} for {selectedItem?.name || "Chemical"}
        </h1>
        <Button
          className="bg-[#3b1f91] hover:bg-purple-700"
          onClick={() => setShowAddSupplierModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
        {chemicalName && (
          <AddSupplierModal
            open={showAddSupplierModal}
            onClose={() => setShowAddSupplierModal(false)}
            chemicalName={selectedItem || "Unknown Chemical"}
            supplier="Supplier"
            onAddSupplier={allSupplier}
            chemicalId={chemicalId}
            refetch={refetch}
            fetchChemicals={fetchChemicals}
          />
        )}
      </div>
      {selectedSuppliers.length > 0 && (
        <div className="p-4 border-b">
          <EmailForm
            selectedSupplier={selectedSuppliers}
            supplier={suppliers}
            email={suppliers
              .filter((s) => selectedSuppliers.includes(s._id))
              .map((s) => s.email)
              .join(", ")}

            name={suppliers
                .filter((s) => selectedSuppliers.includes(s._id))
                .map((s) => s.name)
                .join(", ")}
            chemicalName ={selectedItem?.name }
          />
        </div>
      )}
      {/* Table for Suppliers */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            {/* <TableHead>Country</TableHead> */}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading suppliers...
              </TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-red-500/60">
                No suppliers available.
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            !error &&
            filteredSuppliers.map((supplier) => (
              <TableRow key={supplier._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedSuppliers.includes(supplier._id)}
                    onCheckedChange={() => handleSupplierSelect(supplier._id)}
                  />
                </TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.mobile}</TableCell>
                {/* <TableCell>{supplier.country}</TableCell> */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteClick(supplier._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AlertDialog open={!!supplierToDelete} onOpenChange={() => setSupplierToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier from this chemical.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}