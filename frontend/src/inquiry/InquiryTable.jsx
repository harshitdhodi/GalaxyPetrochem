import { useState } from "react";
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
import { ChevronDown, EllipsisVertical, MoreVertical, Plus } from "lucide-react";
import FollowUpModal from "./FollowUpModel";
import { useDeleteInquiryMutation } from "@/slice/inquiry/inquiry";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetInquiriesQuery } from "@/slice/inquiry/inquiry";
import { Link, Links } from "react-router-dom";
import { useGetAllStatusesQuery } from "@/slice/status/status";
import { Checkbox } from "@/components/ui/checkbox";
import EmailForm from "@/email/emailForm/EmailForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Modal } from "antd";

// Define all possible statuses
const ALL_STATUSES = [
    "Contact in Future",
    "Pending",
    "Completed",
    "In Progress",
    "New Inquiry",
    "Rejected",
    "On Hold"
];

export default function InquiryList() {
    const { data: inquiryData = [], isLoading, isError } = useGetInquiriesQuery();
    console.log(inquiryData)
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [data, setData] = useState(inquiryData);
    const [deleteInquiry] = useDeleteInquiryMutation();
    const { data: statuses, isLoading: statusesLoading } = useGetAllStatusesQuery();
    console.log(statuses)
    // State for filters
    const [companyNameFilter, setCompanyNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState(null);
    const [sourceFilter, setSourceFilter] = useState(null);
    const [nameFilter, setNameFilter] = useState(null);
    const [emailFilter, setEmailFilter] = useState("");
    const [mobileFilter, setMobileFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [selectedInquiries, setSelectedInquiries] = useState([]);
    const [showEmailModal, setShowEmailModal] = useState(false);

    // Filtering function
    const filteredData = inquiryData.filter(item => {
        return (
            (companyNameFilter === "" ||
                item.organisation.toLowerCase().includes(companyNameFilter.toLowerCase())) &&
            (statusFilter === null || item.status === statusFilter) &&
            (sourceFilter === null || item.source === sourceFilter) &&
            (nameFilter === null || 
                `${item.firstName} ${item.lastName}`.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (emailFilter === "" ||
                item.email.toLowerCase().includes(emailFilter.toLowerCase())) &&
            (mobileFilter === "" ||
                item.phone.toLowerCase().includes(mobileFilter.toLowerCase()))
        );
    });

    // Get selected inquiry emails
    const selectedInquiryEmails = filteredData
        ?.filter((inquiry) => selectedInquiries.includes(inquiry._id))
        ?.map((inquiry) => inquiry.email)
        ?.join(", ");

    const handleDelete = async (inquiryId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this inquiry?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteInquiry(inquiryId);
                    setData(prevData => prevData.filter(item => item._id !== inquiryId));
                } catch (error) {
                    console.error("Error deleting inquiry:", error);
                }
            },
        });
    };


    // Handle status update for a specific inquiry
    const handleStatusUpdate = (inquiry, newStatus) => {
        setData(prevData =>
            prevData.map(item =>
                item.companyName === inquiry.companyName
                    ? { ...item, status: newStatus }
                    : item
            )
        );
    };

    const handleFollowUpAdded = (inquiry, newTotalTasks) => {
        setData(prevData =>
            prevData.map(item =>
                item.companyName === inquiry.companyName
                    ? { ...item, totalTasks: newTotalTasks }
                    : item
            )
        );
    };

    const handleInquirySelect = (inquiryId) => {
        setSelectedInquiries((prev) =>
            prev.includes(inquiryId)
                ? prev.filter((id) => id !== inquiryId)
                : [...prev, inquiryId]
        );
    };

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
                        <TableHead className="w-12"></TableHead>
                        <TableHead className="lg:w-[100px] w-[50px] sticky left-0 bg-background z-50">Date</TableHead>
                        <TableHead className="text-left">Info</TableHead>
                        {/* <TableHead className="text-left">Email</TableHead> */}
                        <TableHead className="text-left">Message</TableHead>
                        <TableHead className="text-left">Follow Up</TableHead>
                        <TableHead className="w-[80px] text-left">Actions</TableHead>
                    </TableRow>
                    <TableRow className="border-b">
                        <TableHead></TableHead>
                        <TableHead></TableHead>
                        <TableHead>
                            <Input
                                placeholder="Search Info"
                                className="w-[200px]"
                                value={nameFilter || ""}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </TableHead>
                        {/* <TableHead>
                            <Input
                                placeholder="Email"
                                className="w-[200px]"
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                            />
                        </TableHead> */}
                        <TableHead>
                            <Select
                                value={statusFilter || "reset"}
                                onValueChange={(value) => setStatusFilter(value === "reset" ? null : value)}
                            >
                                {/* <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger> */}
                                <SelectContent>
                                    <SelectItem value="reset">All Statuses</SelectItem>
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
                    {filteredData.map((item, index) => (
                        <TableRow key={index} className="border-b">
                            <TableCell className="p-5">
                                <Checkbox
                                    checked={selectedInquiries.includes(item._id)}
                                    onCheckedChange={() => handleInquirySelect(item._id)}
                                />
                            </TableCell>
                            <TableCell className="sticky left-0 bg-background">{item.createdAt.slice(0, 10)}</TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="font-medium">{item.firstName} {item.lastName},</div>
                                    {item.organisation} ,
                                    <div className="text-sm text-muted-foreground">
                                    {item.email}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                    
                                        {item.phone} • {item.address} 
                                    </div>
                                </div>
                            </TableCell>
                            {/* <TableCell>{item.email}</TableCell> */}
                            <TableCell>{item.message}</TableCell>
                            <TableCell className="text-left">
                                <FollowUpModal
                                    inquiry={item}
                                    onFollowUpAdded={handleFollowUpAdded}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                            <EllipsisVertical className="h-4 w-4" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px]">
                                        <Link to={`/edit-inquiry/${item._id}`}>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem onClick={() => handleDelete(item._id)}>
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
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                <div className="text-sm text-muted-foreground">
                    {`1-${Math.min(itemsPerPage, filteredData.length)} of ${filteredData.length}`}
                </div>
            </div>
        </div>
    );
}