'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, MoreVertical, Plus, Search, X } from 'lucide-react'
import { useDeleteCustomerMutation, useGetCustomersQuery } from '@/slice/customerSlice/customerApiSlice'
import { Link } from 'react-router-dom'
import { ChemicalsDialog } from './components/ChemicalDialog'
import { AddChemicalDialog } from './components/AddChemicalDialog'
import SalesOrderTable from './components/SalesOrderTable'
import { BreadcrumbWithCustomSeparator } from '@/breadCrumb/BreadCrumb'

const breadcrumbItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Customer Table", href: "/supplier-table" },
]

const CustomerTable = () => {
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [showChemicals, setShowChemicals] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [deleteCustomer] = useDeleteCustomerMutation(); // Destructure the delete mutation
  const [isDeleting, setIsDeleting] = useState(false); // To track the loading state

  const [showAddChemical, setShowAddChemical] = useState(false)
  // Fetch customers using RTK Query
  const { data: responseData, isLoading, error , refetch } = useGetCustomersQuery();
  const customers = responseData || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading customers</div>;

 
  const handleExpand = (customerId) => {
    setExpandedRowId(prevExpandedRowId => 
      prevExpandedRowId === customerId ? null : customerId // Toggle logic
    );
  };
  const handleAddChemical = (chemicalName) => {
    // Implement chemical addition logic
    console.log(`Adding chemical: ${chemicalName}`);
  }
  const handleShowChemicals = (customer) => {
    setSelectedCustomer(customer);
    setShowChemicals(true);
  }

  const handleDeleteCustomer = async (supplierId) => {
    try {
        setIsDeleting(true); // Start loading
        await deleteCustomer(supplierId); // Call the mutation with the supplier ID
        // Handle success (e.g., show a success message or update the UI)
        alert("Customer deleted successfully");
    } catch (error) {
        // Handle error
        alert("Failed to delete customer");
    } finally {
        setIsDeleting(false); // End loading
    }
};
  return (
    <>
       <div className="ml-1">
          <BreadcrumbWithCustomSeparator items={breadcrumbItems} />
    
        </div>
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-[#3b1f91]">Customers</h2>
        <Link to="/customer-form">
          <Button>
            <Plus className="mr-2 h-4 w-4 " /> 
            Add Customer
          </Button>
        </Link>
      </div>
      <hr className="border-[#3b1f91] border my-4" />

      <div className="rounded-md border">
  <Table>
    <TableHeader className="bg-gray-100 ">
      <TableRow>
        <TableHead className="w-[50px] border-r-gray-300 bg-gray-100"></TableHead>
        <TableHead className="text-black border-r-gray-300 font-semibold">Name</TableHead>
        <TableHead className="text-black border-r-gray-300 font-semibold">Contact Person</TableHead>
        <TableHead className="text-black border-r-gray-300 font-semibold">Email</TableHead>
        <TableHead className="text-black border-r-gray-300 font-semibold">Mobile/Phone</TableHead>
        <TableHead className="text-black border-r-gray-300 font-semibold">Website</TableHead>
        <TableHead className="text-black  font-semibold">Chemicals Count</TableHead>
        {/* <TableHead className="text-black font-semibold">Location</TableHead>  */}
        {/* New Column */}
        {/* <TableHead className="w-[50px]"></TableHead> */}
      </TableRow>
    </TableHeader>
    <TableBody>
      {/* Filter Row */}
      <TableRow className="bg-gray-100">
        <TableCell></TableCell>
        <TableCell>
          <Input placeholder="Filter name..." className="max-w-sm" />
        </TableCell>
        <TableCell>
          <Input placeholder="Filter contact..." className="max-w-sm" />
        </TableCell>
        <TableCell>
          <Input placeholder="Filter email..." className="max-w-sm" />
        </TableCell>
        <TableCell>
          <Input placeholder="Filter phone..." className="max-w-sm" />
        </TableCell>
        <TableCell>
          <Input placeholder="Filter website..." className="max-w-sm" />
        </TableCell>
        <TableCell>
          <Input placeholder="Filter chemicals..." className="max-w-sm" />
        </TableCell>
        {/* <TableCell>
          <Input placeholder="Filter location..." className="max-w-sm" /> 

        </TableCell> */}
        {/* <TableCell></TableCell> */}
      </TableRow>

      {/* Customer Rows */}
      {customers.map((customer) => (
        <>
          <TableRow key={customer.id}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExpand(customer.id)} // Toggle row expansion
                >
                  {expandedRowId === customer.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link to={`/edit-customer-form/${customer._id}`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteCustomer(customer._id)} // Call delete function
                      disabled={isDeleting} // Optionally disable if mutation is in progress
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowAddChemical(true);
                      }}
                    >
                      Add Chemical
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.contactPerson}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.website}</TableCell>
            <TableCell>
              <Button
              className="hover:bg-[#4f359c]"
                variant="secondary"
                size="sm"
                onClick={() => handleShowChemicals(customer)}
              >
                Chemicals ({customer.chemicalId.length})
              </Button>
            </TableCell>
            {/* <TableCell>{customer.location}</TableCell>
            <TableCell></TableCell> */}
          </TableRow>
          {expandedRowId === customer.id && (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="p-4">
                  {/* Display the Sales Orders Table for the customer */}
                  <SalesOrderTable customerId={customer._id} />
                </div>
              </TableCell>
            </TableRow>
          )}
        </>
      ))}

    
    </TableBody>
  </Table>
</div>


      {/* Chemicals Dialog */}
      <ChemicalsDialog
        open={showChemicals}
        onOpenChange={setShowChemicals}
        customerName={selectedCustomer?.name}
        customerId={selectedCustomer?._id} // Pass selected 
        onAddChemical={handleAddChemical}
        customerRefatch = {refetch}
      />
      {/* Add Chemical Dialog */}
      <AddChemicalDialog
        open={showAddChemical}
        onOpenChange={setShowAddChemical}
        onAddChemical={handleAddChemical}
        customerId={selectedCustomer?._id}
      />
    </div>
    </>
  )
}

export default CustomerTable
