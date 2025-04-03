import React, { useState , useEffect} from "react";
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
import { MoreVertical, Edit, UserPlus, Trash2, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuppliersTable from "@/chemical/SupplierTable";
import CustomerTable from "./chemicalTable/CustomerTable";
import AddSupplierModal from "./chemicalTable/AddSupplierModel";
import { ChemicalProvider, useChemical } from "./ChemicalContext";
import axios from "axios";

const chemicals = [
  {
    id: 1,
    name: "Acid red 27",
    casNumber: "915-67-3",
    molecularFormula: "C20H11N2Na3O10S3",
    suppliers: 0,
    customers: 2, 
    unitName: "Kg",
  },
  {
    id: 2,
    name: "Acid Red 89",
    casNumber: "5413-75-2",
    molecularFormula: "C20H13N2NaO4S",
    suppliers: 0,
    customers: 0,
    unitName: "Kg",
  },
  // Add more items as needed
];

export default function ChemicalTable() {
  const { selectedChemicalName, setChemicalName } = useChemical(); // Get and set chemical name from context
  const [chemicals, setChemicals] = useState([]);
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

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        const response = await axios.get("/api/chemical/get");
        setChemicals(response.data);
      } catch (error) {
        console.error("Error fetching chemicals:", error);
      }
    };
    fetchChemicals();
  }, []);

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
    // Implement edit functionality
  };

  const handleAddSupplierClick = (chemical) => {
    setSelectedItem(chemical);
    setShowAddSupplierModal(true);
    setModalType('supplier');
  };

  const handleAddCustomer  = (chemical) => {
    setSelectedItem(chemical);
    setShowAddCustomerModal(true);
    setModalType('customer');
  };

  const handleDelete = (chemical) => {
    console.log("Delete", chemical);
    // Implement delete functionality
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#3b1f91]">Chemical List</h2>
        </div>
        <div>
          <Button>
            <PlusCircle /> Add Chemical
          </Button>
        </div>
      </div>
      <div className="mb-5">
        <hr />
      </div>
      <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>CAS Number</TableHead>
            <TableHead>Molecular Formula</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
          <TableRow>
            <TableHead></TableHead>
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((chemical) => (
            <TableRow key={chemical._id}>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(chemical)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddSupplierClick(chemical)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Supplier
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
              <TableCell>{chemical.unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
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
        <Dialog open={showSuppliers} onOpenChange={setShowSuppliers}>
          <DialogContent className="max-w-6xl">
            <SuppliersTable chemicalName={selectedItem} supplier="Supplier" />

          </DialogContent>
        </Dialog>

        <Dialog open={showCustomers} onOpenChange={setShowCustomers}>
          <DialogContent className="max-w-6xl">
            <CustomerTable selectedItems={selectedItem} supplier="Customer"  />
          </DialogContent>
        </Dialog>
      </ChemicalProvider>
    </div>
  );
}
