import React from 'react';
import { Table, Space, Breadcrumb, Modal, message, Button } from 'antd';
import { EditOutlined, DeleteOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetAllApplicationsQuery, useDeleteApplicationMutation } from '../../slice/career/CareerForm';

const CareerTable = () => {
    const navigate = useNavigate();
    const { data: applications, isLoading } = useGetAllApplicationsQuery();
    const [deleteApplication] = useDeleteApplicationMutation();

    const handleEdit = (record) => {
        navigate(`/career/edit/${record._id}`);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this application?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteApplication(id).unwrap();
                    message.success('Application deleted successfully!');
                } catch (error) {
                    message.error(error.message || 'Something went wrong');
                }
            },
        });
    };

    const handleDownload = async (filePath) => {
        try {
            const filename = filePath.split('/').pop();
            const response = await fetch(`/api/image/pdf/download/${filename}`);
            
            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            message.error('Failed to download file');
            console.error('Download error:', error);
        }
    };

    const columns = [
        {
            title: 'Info',
            key: 'info',
            render: (_, record) => (
                <div>
                    <strong>{record.name}</strong>
                    <div>{record.contactNo}</div>
                    <div style={{ color: '#666' }}>{record.address}</div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Post Applied For',
            dataIndex: 'postAppliedFor',
            key: 'postAppliedFor',
            sorter: (a, b) => a.postAppliedFor.localeCompare(b.postAppliedFor),
        },
        {
            title: 'Resume',
            key: 'resume',
            render: (_, record) => (
                <DownloadOutlined 
                    onClick={() => handleDownload(record.resumeFile)}
                    style={{ cursor: 'pointer', color: '#1890ff' }}
                />
            ),
        },
        {
            title: 'Applied Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined 
                        style={{ color: '#1890ff', cursor: 'pointer' }}
                        onClick={() => handleEdit(record)}
                    />
                    <DeleteOutlined 
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                        onClick={() => handleDelete(record._id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div >
            <Breadcrumb
                items={[
                    { 
                        title: <span onClick={() => navigate('/dashboard')} className='cursor-pointer'>
                            Dashboard
                        </span>
                    },
                    { title: 'Career Applications' }
                ]}
                className='mb-4'
            />

           <div className='flex justify-between items-center mb-5'>
            <div className='text-2xl font-semibold'>Career List </div>
           <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/career/add')}
                style={{ marginBottom: '16px' }}
                className='float-right'
            >
                Add New Application
            </Button>
           </div>

            <Table 
                columns={columns}
                dataSource={applications?.data || []}
                loading={isLoading}
                rowKey="_id"
                pagination={{ 
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} applications`
                }}
                scroll={{ x: true }}
            />
        </div>
    );
};

export default CareerTable; 