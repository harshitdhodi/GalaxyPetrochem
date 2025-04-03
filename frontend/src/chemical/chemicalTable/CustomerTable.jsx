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
import EmailForm from "../EmailForm";
import { ChemicalContext } from "../ChemicalContext";
import AddSupplierModal from "./AddSupplierModel";  // Adjust modal import
import { useGetCustomersQuery, useGetCustomersByChemicalIdQuery, useRemoveChemicalFromCustomerMutation } from "@/slice/customerSlice/customerApiSlice";

export default function CustomersTable({ chemicalName, supplier }) {

    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const { selectedItem } = useContext(ChemicalContext);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

    const [nameFilter, setNameFilter] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [mobileFilter, setMobileFilter] = useState("");
    const [countryFilter, setCountryFilter] = useState("");

    const { data: allCustomers = [] } = useGetCustomersQuery();
    const { data: customers = [], isLoading, error, refetch } = useGetCustomersByChemicalIdQuery(selectedItem._id);
    const [removeChemicalFromCustomer] = useRemoveChemicalFromCustomerMutation();

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        customer.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        customer.mobile.toLowerCase().includes(mobileFilter.toLowerCase()) &&
        customer.country.toLowerCase().includes(countryFilter.toLowerCase())
    );

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomers((prev) =>
            prev.includes(customerId)
                ? prev.filter((id) => id !== customerId)
                : [...prev, customerId]
        );
    };
    console.log(selectedCustomers)
    const handleDeleteCustomer = async (customerId) => {
        try {
            await removeChemicalFromCustomer({
                customerId,
                chemicalId: selectedItem._id
            });
        } catch (error) {
            console.error('Failed to remove customer:', error);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[#3b1f91]">
                    {supplier} for {selectedItem.name}
                </h1>
                <Button
                    className="bg-[#3b1f91] hover:bg-purple-700"
                    onClick={() => setShowAddCustomerModal(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <AddSupplierModal
                open={showAddCustomerModal}
                onClose={() => setShowAddCustomerModal(false)}
                chemicalName={selectedItem}
                supplier="Customer"
                onAddSupplier={allCustomers}
                refetch={refetch}
            />

            {selectedCustomers.length > 0 && (
                <div className="p-4 border-b">
                    <EmailForm selectedSupplier={selectedCustomers} supplier={customers} chemicalName={chemicalName.name} type={supplier} />
                </div>
            )}

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Mobile</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        )}
                        {error && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-red-500">
                                    Error loading customers.
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && !error && filteredCustomers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading &&
                            !error &&
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedCustomers.includes(customer.id)}
                                            onCheckedChange={() => handleCustomerSelect(customer.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.mobile}</TableCell>
                                    <TableCell>{customer.country}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => handleDeleteCustomer(customer._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <div className="flex items-center justify-between border-t p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Items per page: 10</span>
                        <span>1 - {filteredCustomers.length} of {filteredCustomers.length}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" disabled>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

