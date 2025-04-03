import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FollowUpTable } from './followup/FollowUpTable';
import { AddFollowUpModal } from './followup/AddFollwUpModel';
import {
    useGetMessagesCountByInquiryIdQuery,
    useCreateMessageMutation,
    useDeleteMessageMutation,
    useGetMessageByInquiryIdQuery
} from '@/slice/followUp/followUp';
import EditFollowUpModal from './followup/EditFollowUp';
import { Badge } from '@/components/ui/badge';

// Main FollowUpModal Container Component
// Main FollowUpModal Container Component
export default function FollowUpModal({ inquiry, onFollowUpAdded }) {

    const [isOpen, setIsOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedFollowUp, setSelectedFollowUp] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch message count using the inquiryId
    const { data: followUpCountData, error, isLoading, refetch } = useGetMessageByInquiryIdQuery(inquiry._id);

    useEffect(() => {
        if (error) {
            console.error("Error fetching follow-up count:", error);
        }
    }, [error]);

    // Extract follow-ups and calculate pagination
    const followUps = followUpCountData?.data || [];
    const followUpCount = followUps.length;
    const totalPages = Math.ceil(followUpCount / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFollowUps = followUps.slice(indexOfFirstItem, indexOfLastItem);

    const [createMessage, { isLoading: isCreating }] = useCreateMessageMutation();
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

    // Handle modal open/close
    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (open) {
            refetch();
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle add follow-up
    const handleAddFollowUp = async (newFollowUp) => {
        if (newFollowUp.date && newFollowUp.message) {
            const newMessage = {
                inquiryId: inquiry._id,
                date: newFollowUp.date,
                message: newFollowUp.message,
            };
            try {
                await createMessage(newMessage).unwrap();
                refetch();
                onFollowUpAdded(inquiry, followUpCount + 1);
                setIsAddModalOpen(false);
            } catch (error) {
                console.error("Failed to add follow-up:", error);
            }
        }
    };

    // Handle edit follow-up
    const handleEditFollowUp = (followUp) => {
        setSelectedFollowUp(followUp);
        setEditModalOpen(true);
    };

    // Handle delete follow-up
    const handleDeleteFollowUp = async (followUpId) => {
        try {
            await deleteMessage(followUpId).unwrap();
            refetch();
            onFollowUpAdded(inquiry, followUpCount - 1);
        } catch (error) {
            console.error("Failed to delete follow-up:", error);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="text-right bg-[#3b1f91] text-white">
                        Follow Up 
                        <Badge variant="outline" className="bg-[#ffffff] text-black">{followUpCount}

                        </Badge>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[60%] h-auto">
                    <div className="grid gap-4">
                        <div className="flex justify-between items-center mt-5 mb-4">
                            <DialogHeader>
                                <DialogTitle>Follow Up - {inquiry.firstName} {inquiry.lastName}</DialogTitle>
                            </DialogHeader>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                Add Follow Up
                            </Button>
                        </div>

                        <FollowUpTable
                            followUps={currentFollowUps}
                            onEdit={handleEditFollowUp}
                            onDelete={handleDeleteFollowUp}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <AddFollowUpModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddFollowUp={handleAddFollowUp}
            />

            <EditFollowUpModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                followUpId={selectedFollowUp}
                onSave={() => {
                    refetch();
                    setEditModalOpen(false);
                }}
            />
        </>
    );
}

