// SuppliersDashboard.js

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
// import SuppliersTable from './SuppliersTable';  // Import SuppliersTable here
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ChemicalTable from './ChemicalTable';
// import PurchaseOrderTable from './PurchaseOrderTable';  // Import PurchaseOrderTable
// import { useGetSuppliersQuery } from '@/services/suppliers';  // Assuming you have a query hook for fetching suppliers
import SuppliersTable from './supplierTable/SupplierTable';
import PurchaseOrdersTable from './supplierTable/PurchaseOrder';
import { useGetSuppliersQuery } from '@/slice/supplierSlice/SupplierSlice';
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb';
import { Link } from 'react-router-dom';
const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Supplier Table", href: null },
]
export default function SuppliersDashboard() {
  const [showPurchaseOrders, setShowPurchaseOrders] = useState({});
  const [showChemicalsModal, setShowChemicalsModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { data: suppliers = [], isLoading, error ,refetch } = useGetSuppliersQuery();  // Fetch suppliers from the API
  const [filters, setFilters] = useState({});

  if (isLoading) return <p>Loading suppliers...</p>;
  if (error) return <p>Failed to load suppliers</p>;

  const handleFilterChange = (field, value) => {
    setFilters(prevFilters => ({
        ...prevFilters,
        [field]: value,
    }));
};

  const handleChemicalClick = (supplier) => {
    console.log('Opening chemical modal for supplier:', supplier);
    setSelectedSupplier(supplier);
    setShowChemicalsModal(true);
  };

  return (
    <div className="">
       <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
          
      <div className="flex justify-between mt-4 items-center mb-6">
        <h1 className="text-2xl font-medium text-[#3b1f91] ">Suppliers</h1>
        <Link to="/supplier-form">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
        </Link>
       
      </div>

      {/* Pass selectedSupplier and other props to SuppliersTable */}
      <SuppliersTable 
        suppliers={suppliers} 
        showPurchaseOrders={showPurchaseOrders} 
        setShowPurchaseOrders={setShowPurchaseOrders} 
        setSelectedSupplier={setSelectedSupplier} 
        setShowChemicalsModal={setShowChemicalsModal} 
        filters={filters} 
        handleFilterChange={handleFilterChange}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        paginatedData={suppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}  // Paginated suppliers data
        selectedSupplier={selectedSupplier} // Pass selectedSupplier here
        refetch = {refetch}
        onChemicalClick={handleChemicalClick}
     />

      {/* Display Purchase Order Table when showPurchaseOrders is true */}
      {showPurchaseOrders[selectedSupplier?.id] && selectedSupplier && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Purchase Orders for {selectedSupplier.name}</h2>
          <PurchaseOrdersTable purchaseOrders={[]} />  {/* Replace with actual purchase order data */}
        </div>
      )}

      {/* Chemical modal */}
      <Dialog 
        open={showChemicalsModal} 
        onOpenChange={(open) => {
          console.log('Modal state changing to:', open);
          setShowChemicalsModal(open);
        }}
      >
        <DialogContent className="max-w-2xl h-1/2">
          <ChemicalTable supplier={selectedSupplier?._id} supplierName={selectedSupplier?.name} allData = {refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
