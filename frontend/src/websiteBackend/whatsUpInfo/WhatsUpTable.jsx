// filepath: /c:/Users/Admin/Desktop/CDHCHEMICAL/git/frontend/src/components/WhatsUpInfoTable.jsx
import React, { useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import WhatsUpInfoForm from './WhatUpForm';
import { useGetWhatsUpInfoQuery ,useDeleteWhatsUpInfoByIdMutation  } from '@/slice/whatsUpInfo/WhatsUpInfo';
import EventModal from '@/dashboard/calender/event-modal';

const WhatsUpInfoTable = () => {
    const { data: whatsUpInfo, error, isLoading } = useGetWhatsUpInfoQuery();
    const [deleteWhatsUpInfoById] = useDeleteWhatsUpInfoByIdMutation();
    const [editingInfo, setEditingInfo] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleDelete = async (id) => {
        try {
            await deleteWhatsUpInfoById(id).unwrap();
            message.success('WhatsUp Info deleted successfully!');
        } catch (error) {
            message.error('Failed to delete WhatsUp Info.');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button
                        type="link"
                        onClick={() => {
                            setEditingInfo(record);
                            setIsModalVisible(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this WhatsUp Info?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setEditingInfo(null);
                    setIsModalVisible(true);
                }}
            >
                Add WhatsUp Info
            </Button>
            <Table
                columns={columns}
                dataSource={whatsUpInfo}
                rowKey="id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
            />
            {isModalVisible && (
                <EventModal
                    title={editingInfo ? 'Edit WhatsUp Info' : 'Add WhatsUp Info'}
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                >
                    <WhatsUpInfoForm
                        initialValues={editingInfo}
                        onClose={() => setIsModalVisible(false)}
                    />
                </EventModal>
            )}
        </div>
    );
};

export default WhatsUpInfoTable;