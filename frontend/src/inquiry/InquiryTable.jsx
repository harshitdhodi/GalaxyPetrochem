import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, EllipsisVertical, Plus } from "lucide-react";
import { useDeleteInquiryMutation as useDeleteGeneralInquiryMutation, useGetInquiriesQuery as useGetGeneralInquiriesQuery } from "@/slice/inquiry/inquiry";
import { useGetInquiriesQuery as useGetProductInquiriesQuery, useDeleteInquiryMutation as useDeleteProductInquiryMutation } from "@/slice/inquiry/productInquiry";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useGetAllStatusesQuery } from "@/slice/status/status";
import EmailForm from "@/email/emailForm/EmailForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Modal } from "antd";

export default function InquiryList() {
    // Fetch both general and product inquiries
    const { data: generalInquiriesResponse, isLoading: isLoadingGeneral } = useGetGeneralInquiriesQuery();
    const { data: productInquiriesResponse, isLoading: isLoadingProduct } = useGetProductInquiriesQuery();
    
    // Safely extract arrays from responses
    const generalInquiriesData = Array.isArray(generalInquiriesResponse) 
        ? generalInquiriesResponse 
        : generalInquiriesResponse?.data || [];
        
    const productInquiriesData = Array.isArray(productInquiriesResponse) 
        ? productInquiriesResponse 
        : productInquiriesResponse?.inquiries || [];
    
    const [deleteGeneralInquiry] = useDeleteGeneralInquiryMutation();
    const [deleteProductInquiry] = useDeleteProductInquiryMutation();
    const { data: statuses } = useGetAllStatusesQuery();

    // State for filters and pagination
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [companyNameFilter, setCompanyNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [sourceFilter, setSourceFilter] = useState(null);
    const [nameFilter, setNameFilter] = useState(null);
    const [emailFilter, setEmailFilter] = useState("");
    const [mobileFilter, setMobileFilter] = useState("");
    const [selectedInquiries, setSelectedInquiries] = useState([]);
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Combine and normalize data from both sources
    const combinedData = useMemo(() => {
        const mappedGeneral = generalInquiriesData.map(item => ({
            ...item,
            type: 'General',
            displayName: `${item.firstName} ${item.lastName}`,
            isProductInquiry: false,
        }));

        const mappedProduct = productInquiriesData.map(item => ({
            ...item,
            type: 'Product',
            displayName: item.name,
            firstName: item.name, // For filtering consistency
            lastName: '',
            organisation: item.productName || 'N/A', // Use product name for organisation field
            address: 'N/A',
            status: 'Product Inquiry', // Assign a virtual status
            isProductInquiry: true,
        }));

        return [...mappedGeneral, ...mappedProduct].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [generalInquiriesData, productInquiriesData]);

    // Filtering function on combined data
    const filteredData = combinedData.filter(item => {
        return (
            (companyNameFilter === "" ||
                (item.organisation && item.organisation.toLowerCase().includes(companyNameFilter.toLowerCase()))) &&
            (statusFilter === null || item.status === statusFilter) &&
            (sourceFilter === null || item.source === sourceFilter) &&
            (nameFilter === null || 
                (item.displayName && item.displayName.toLowerCase().includes(nameFilter.toLowerCase()))) &&
            (emailFilter === "" ||
                (item.email && item.email.toLowerCase().includes(emailFilter.toLowerCase()))) &&
            (mobileFilter === "" ||
                (item.phone && item.phone.toLowerCase().includes(mobileFilter.toLowerCase())))
        );
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };

    const selectedInquiryEmails = filteredData
        ?.filter((inquiry) => selectedInquiries.includes(inquiry._id))
        ?.map((inquiry) => inquiry.email)
        ?.join(", ");

    const handleDelete = async (inquiryId, type) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this inquiry?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    if (type === 'Product') {
                        await deleteProductInquiry(inquiryId);
                    } else {
                        await deleteGeneralInquiry(inquiryId);
                    }
                } catch (error) {
                    console.error("Error deleting inquiry:", error);
                }
            },
        });
    };

    const handleInquirySelect = (inquiryId) => {
        setSelectedInquiries((prev) =>
            prev.includes(inquiryId)
                ? prev.filter((id) => id !== inquiryId)
                : [...prev, inquiryId]
        );
    };

    const goToFirstPage = () => setCurrentPage(1);
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };

    if (isLoadingGeneral || isLoadingProduct) {
        return <div>Loading inquiries...</div>;
    }

    return (
        <div className="p-4">
            {selectedInquiries.length > 0 && (
                <div className="mb-4">
                    <Button 
                        onClick={() => setShowEmailModal(true)}
                        className="bg-[#3b1f91] hover:bg-purple-700"
                    >
                        Send Email to Selected ({selectedInquiries.length})
                    </Button>
                </div>
            )}

            <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Send Email to Selected Inquiries</DialogTitle>
                    </DialogHeader>
                    <EmailForm 
                        defaultTo={selectedInquiryEmails}
                        onSuccess={() => {
                            setShowEmailModal(false);
                            setSelectedInquiries([]);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Inquiry List</h1>
                <Link to='/add-inquiry'>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Inquiry
                    </Button>
                </Link>
            </div>

            <Table className="border">
                <TableHeader>
                    <TableRow className="border-b bg-gray-100">
                        <TableHead className="lg:w-[100px] w-[50px] sticky left-0 bg-background z-50">Date</TableHead>
                        <TableHead className="text-left">Info</TableHead>
                        <TableHead className="text-left">Message</TableHead>
                        <TableHead className="w-[80px] text-left">Actions</TableHead>
                    </TableRow>
                    <TableRow className="border-b">
                        <TableHead>
                            <Input
                                placeholder="Search Info"
                                className="w-[200px]"
                                value={nameFilter || ""}
                                onChange={(e) => handleFilterChange(setNameFilter)(e.target.value)}
                            />
                        </TableHead>
                        <TableHead>
                            <Select
                                value={statusFilter || "reset"}
                                onValueChange={(value) => handleFilterChange(setStatusFilter)(value === "reset" ? null : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reset">All Statuses</SelectItem>
                                    <SelectItem value="Product Inquiry">Product Inquiry</SelectItem>
                                    {statuses?.data?.map((status) => (
                                        <SelectItem key={status._id} value={status.status}>
                                            {status.status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableHead>
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((item, index) => (
                        <TableRow key={item._id || index} className="border-b">
                            <TableCell className="sticky left-0 bg-background">{item.createdAt.slice(0, 10)}</TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium">{item.displayName}</div>
                                    <div>{item.organisation}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.phone} • {item.address} 
                                    </div>
                                    <div className="text-xs font-semibold uppercase text-blue-600">{item.type} Inquiry</div>
                                </div>
                            </TableCell>
                            <TableCell>{item.message}</TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                            <EllipsisVertical className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        {item.isProductInquiry ? (
                                             <DropdownMenuItem disabled style={{ color: '#999' }}>Edit (N/A)</DropdownMenuItem>
                                        ) : (
                                            <Link to={`/edit-inquiry/${item._id}`}>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                            </Link>
                                        )}
                                        <DropdownMenuItem onClick={() => handleDelete(item._id, item.type)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Items per page:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue>{itemsPerPage}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        {filteredData.length > 0 
                            ? `${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length}`
                            : '0 of 0'
                        }
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={goToFirstPage} disabled={currentPage === 1} className="h-8 w-8 text-gray-800">
                            <ChevronLeft className="h-4 w-4" /><ChevronLeft className="h-4 w-4 -ml-3" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage === 1} className="h-8 w-8 text-gray-800">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-1 px-2">
                            <span className="text-sm font-medium">{currentPage}</span>
                            <span className="text-sm text-muted-foreground">of</span>
                            <span className="text-sm font-medium">{totalPages || 1}</span>
                        </div>

                        <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0} className="h-8 w-8 text-gray-800">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={goToLastPage} disabled={currentPage === totalPages || totalPages === 0} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4 text-gray-800 " /><ChevronRight className="h-4 w-4 -ml-3 text-gray-800" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}