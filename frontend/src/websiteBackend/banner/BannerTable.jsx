import React, { useState } from 'react';
import { Table, Button, Space, message, Breadcrumb, Input, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { useGetAllBannersQuery, useDeleteBannerMutation } from '../../slice/banner/banner';
import { useNavigate, Link } from 'react-router-dom';

const BannerTable = () => {
  const navigate = useNavigate();
  const { data: bannerData, isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id).unwrap();
      message.success('Banner deleted successfully');
    } catch (error) {
      message.error(error.data?.message || 'Failed to delete banner');
    }
  };

  // Filter data based on search text (safely handling undefined titles)
  const filteredData = bannerData?.filter((banner) => {
    const title = banner.title && banner.title !== 'undefined' ? banner.title : '';
    return title.toLowerCase().includes(searchText.trim().toLowerCase());
  });
console.log('Banner data:', bannerData);
  console.log('Filtered data:', filteredData);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '20%',
      render: (image) => (
        <img 
          src={`/api/image/download/${image}`} 
          alt="Banner" 
          style={{ width: '150px', height: '50px', objectFit: 'cover' }} 
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
      render: (title) => (title && title !== 'undefined' ? title : 'No Title'),
    },
    {
      title: 'Page Slug',
      dataIndex: 'pageSlug',
      key: 'pageSlug',
      width: '20%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '10%',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-banner-form/${record._id}`)}
          />
          <Popconfirm
            title="Delete the banner"
            description="Are you sure you want to delete this banner?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ padding: '16px 24px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Banner Management</Breadcrumb.Item>
      </Breadcrumb>
      
      <div style={{ padding: '24px' }} className='flex justify-between items-center'>
        <div className='text-2xl font-bold'>
          <h1>Banner Management</h1>   
        </div>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-banner')}
            style={{ marginBottom: '16px' }}
          >
            Add New Banner
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ padding: '0 24px 16px 24px' }}>
        <Input
          placeholder="Search by title..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: '400px' }}
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        loading={isLoading}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BannerTable;