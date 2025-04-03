import React, { useState ,useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreVertical, Edit, UserPlus, Trash2, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuppliersTable from "./chemicalTable/SupplierTable";
import CustomerTable from "./chemicalTable/CustomerTable";
import AddSupplierModal from "./chemicalTable/AddSupplierModel";
import { ChemicalProvider, useChemical } from "./ChemicalContext";
import axios from "axios";
import { useGetSupplierCountByChemicalIdQuery, useGetSuppliersQuery } from "@/slice/supplierSlice/SupplierSlice";
import { useGetCustomersQuery } from "@/slice/customerSlice/customerApiSlice";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


export default function ChemicalTable() {
  const { selectedChemicalName, setChemicalName } = useChemical(); // Get and set chemical name from context
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const [casFilter, setCasFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [selectedChemical, setSelectedChemical] = useState(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [modalType, setModalType] = useState(null); // New state to track modal type
  const [chemicals, setChemicals] = useState([]);
  const { data: suppliers = [], isLoading, error } = useGetSuppliersQuery()
  const { data: customers = [], isLoading2, error2 } = useGetCustomersQuery()
  const supplierCountQuery = useGetSupplierCountByChemicalIdQuery(selectedItem?._id);
const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchChemicals();
  }, [refreshTrigger]);

  const fetchChemicals = async () => {
    try {
      const response = await axios.get("/api/chemical/get");
      setChemicals(response.data);
    } catch (error) {
      console.error("Error fetching chemicals:", error);
    }
  };
 

  const filteredChemicals = chemicals.filter((chemical) => {
    const chemicalName = chemical.name || ""; // Fallback to empty string if undefined
    const casNumber = chemical.casNumber || ""; // Fallback to empty string if undefined
  
    return (
      chemicalName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      casNumber.includes(casFilter)
    );
  });

  const paginatedData = filteredChemicals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredChemicals.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page on items change
  };

  const handleEdit = (chemical) => {
    console.log("Edit", chemical);
    navigate(`/edit-chemical-form/${chemical._id}`)
    // Implement edit functionality
  };
  const handleAddSupplierClick = (chemical) => {
    setSelectedItem(chemical);
    setShowAddSupplierModal(true);
    setModalType('supplier');
  };

  const handleAddCustomer = (chemical) => {
    setSelectedItem(chemical);
    setShowAddCustomerModal(true);
    setModalType('customer');
  };

  const handleDelete = async (chemical) => {
  try {
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (confirmResult.isConfirmed) {
      const response = await axios.delete(`/api/chemical/delete?id=${chemical._id}`);

    if (response.data.success || response.data.message === "Chemical deleted successfully") {
      // Update the state to remove the deleted chemical
      setChemicals((prevChemicals) =>
        prevChemicals.filter((c) => c._id !== chemical._id)
      );

      // Re-fetch the chemicals after successful deletion
      await fetchChemicals();

      await Swal.fire({
        title: 'Deleted!',
        text: 'The chemical has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      throw new Error(response.data.message || 'Failed to delete the chemical');
    }
  } else {
    Swal.fire({
      title: 'Cancelled',
      text: 'Your chemical is safe!',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false,
    });
  }
} catch (error) {
  console.error("Error deleting chemical:", error);
  if (error.message === "Chemical deleted successfully") {
    // This is actually a success case
    Swal.fire({
      title: 'Deleted!',
      text: 'The chemical has been deleted.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      title: 'Error!',
      text: error.message || 'An error occurred while deleting the chemical.',
      icon: 'error',
      confirmButtonText: 'Ok',
    });
  }
}
};
  



  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#3b1f91]">Chemical List</h2>
        </div>
        <div>
          <Link to="/chemical-form">
          <Button className="bg-[#3b1f91] hover:bg-[#2a1664]">
            <PlusCircle /> Add Chemical
          </Button>
          </Link>
        </div>
      </div>
      <div className="mb-5">
        <hr />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>CAS Number</TableHead>
              <TableHead>Molecular Formula</TableHead>
              <TableHead>Suppliers</TableHead>
              <TableHead>Customers</TableHead>
              <TableHead>Unit Name</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>
                <Input
                  placeholder="Filter by Name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </TableHead>
              <TableHead>
                <Input
                  placeholder="Filter by CAS Number"
                  value={casFilter}
                  onChange={(e) => setCasFilter(e.target.value)}
                />
              </TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((chemical) => (
              <TableRow key={chemical.id}>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-3">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEdit(chemical)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddSupplierClick(chemical)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Supplier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAddCustomer(chemical)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(chemical)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{chemical.name}</TableCell>
                <TableCell>{chemical.cas_number}</TableCell>
                <TableCell>{chemical.molecular_formula}</TableCell>
               
                <TableCell>
                  <Button
                    variant="default"
                    className="bg-[#3b1f91] hover:bg-[#3b1f91]"
                    onClick={() => {
                      setSelectedItem(chemical);
                      setShowSuppliers(true);
                    }}
                  >
                     Suppliers ({chemical.supplierCount})
             
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    className="bg-[#3b1f91] hover:bg-[#3b1f91]"
                    onClick={() => {
                      setSelectedItem(chemical);
                      setShowCustomers(true);
                    }}
                  >
                    Customers({chemical.customerCount})
                  </Button>
                </TableCell>
                <TableCell>{chemical.unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {selectedItem && (
            <AddSupplierModal
              open={modalType === 'supplier' ? showAddSupplierModal : showAddCustomerModal}
              onClose={() => {
                if (modalType === 'supplier') {
                  setShowAddSupplierModal(false);
                } else {
                  setShowAddCustomerModal(false);
                }
                setModalType(null);
                setRefreshTrigger(prev => prev + 1);
                fetchChemicals();
              }}
              chemicalName={selectedItem.name}
              supplier={modalType === 'supplier' ? 'Supplier' : 'Customer'}
              onAddSupplier={modalType === 'supplier' ? suppliers : customers}
              chemicalId={selectedItem._id}
              fetchChemicals={fetchChemicals}
            />
          )}



        </Table>
      </div>


      {/* pegination section  */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Items per page:</p>
          <Select defaultValue={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm font-medium">
            {`${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
              currentPage * itemsPerPage,
              filteredChemicals.length
            )} of ${filteredChemicals.length}`}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= filteredChemicals.length}
          >
            {">"}
          </Button>
        </div>
      </div>

      <ChemicalProvider selectedItem={selectedItem}>
      {selectedItem && (
        <>
        <Dialog open={showSuppliers} onOpenChange={setShowSuppliers}>
          <DialogContent className="max-w-6xl">
            <SuppliersTable 
              chemicalName={selectedItem} 
              chemicalId={selectedItem._id} 
              supplier="Supplier"
              fetchChemicals={fetchChemicals}
            />
          </DialogContent>
        </Dialog><Dialog open={showCustomers} onOpenChange={setShowCustomers}>
            <DialogContent className="max-w-6xl">
              <CustomerTable 
                selectedItems={selectedItem} 
                supplier="Customer" 
                chemicalName={selectedItem} 
                chemicalId={selectedItem._id}
                onUpdate={() => {
                  fetchChemicals();
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </DialogContent>
          </Dialog></>
      )}
      </ChemicalProvider>
    </div>
  );
}

