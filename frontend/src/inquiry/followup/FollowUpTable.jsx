import { Table, Modal } from "antd";
import { useUpdateMessageMutation, useGetMessagesQuery } from "@/slice/followUp/followUp";

import { useState } from "react";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export function FollowUpTable({
    followUps,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    onPageChange,
}) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);

    const [updateMessage] = useUpdateMessageMutation();
    const { refetch } = useGetMessagesQuery();

    const handleUpdate = async (id, updateData) => {
        try {
            const result = await updateMessage({ 
                id,
                ...updateData
            }).unwrap();
            await refetch();
            console.log('Update result:', result);
        } catch (error) {
            console.error(`Failed to update message ID: ${id}`, error);
        }
    };

    const handleStatusChange = (id, newStatus) => {
        handleUpdate(id, { status: newStatus });
    };

    const handleDeleteClick = (id) => {
        setDeleteItemId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteItemId) {
            await onDelete(deleteItemId);
            await refetch();
            
            if (followUps.length === 1 && currentPage > 1) {
                onPageChange(currentPage - 1);
            } else {
                refetch();
            }
            
            setIsDeleteModalOpen(false);
            setDeleteItemId(null);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <select
                    value={status || "New"}
                    onChange={(e) => handleStatusChange(record._id, e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-4 ">
                    <EditOutlined
                        className="cursor-pointer bg-blue-700 text-white p-2 rounded-full"
                        onClick={() => onEdit(record._id)}
                    />
                    <DeleteOutlined
                        className="cursor-pointer bg-red-600 text-white p-2 rounded-full"
                        onClick={() => handleDeleteClick(record._id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={followUps}
                rowKey="_id"
                pagination={{
                    current: currentPage,
                    total: totalPages * 10,
                    onChange: onPageChange,
                }}
            />

            <Modal
                title="Confirm Delete"
                open={isDeleteModalOpen}
                onOk={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                okText="Yes, delete"
                cancelText="Cancel"
                className="mt-16"
            >
                <p>Are you sure you want to delete this follow-up?</p>
            </Modal>
        </>
    );
}
