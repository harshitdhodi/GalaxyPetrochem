import React from 'react';
import { Table, Space, Breadcrumb, Modal, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAllWorldwideQuery, useDeleteWorldwideMutation } from '../../slice/worldwide/worldwide';
import { useNavigate } from 'react-router-dom';

const WorldWideBackend = () => {
    const navigate = useNavigate();
    const { data: worldwideData, isLoading } = useGetAllWorldwideQuery();
    const [deleteWorldwide] = useDeleteWorldwideMutation();

    // Separate international and Indian data
    const internationalData = worldwideData?.data?.filter(item => item.category === 'international') || [];
    const indianData = worldwideData?.data?.filter(item => item.category === 'india') || [];

    // Column definitions for international table
    const internationalColumns = [
        {
            title: 'Country Name',
            dataIndex: 'name',
            key: 'name',
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

    // Column definitions for Indian locations table
    const indianColumns = [
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Cities',
            dataIndex: 'cities',
            key: 'cities',
            render: (cities) => cities.join(', ')
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

    const handleEdit = (record) => {
        navigate(`/worldwide/edit/${record._id}`);
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this location?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteWorldwide(id).unwrap();
                    Modal.success({
                        content: 'Location deleted successfully!',
                    });
                } catch (error) {
                    Modal.error({
                        title: 'Delete Failed',
                        content: error.message || 'Something went wrong',
                    });
                }
            },
        });
    };

    return (
        <div >
          <div className='flex justify-between items-center'>
          <Breadcrumb
                items={[
                    { 
                        title: <span onClick={() => navigate('/dashboard')} className='cursor-pointer'>Dashboard</span>
                    },
                    { title: 'Worldwide Locations' }
                ]}
                className='mb-4'
               
            />

            <Button 
                type="primary" 
                onClick={() => navigate('/worldwide/add')}
               className='mb-4'
            >
                Add New Location
            </Button>
          </div>

            <h2 className='text-2xl font-semibold mb-3'>International Locations</h2>
            <Table 
                columns={internationalColumns}
                dataSource={internationalData}
                loading={isLoading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />

            <h2 className='text-2xl font-semibold mb-3 mt-8'>Indian Locations</h2>
            <Table 
                columns={indianColumns}
                dataSource={indianData}
                loading={isLoading}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default WorldWideBackend;
