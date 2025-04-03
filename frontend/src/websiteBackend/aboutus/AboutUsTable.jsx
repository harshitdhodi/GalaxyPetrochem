import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetAboutUsQuery, useDeleteAboutUsMutation } from '../../slice/aboutUs/aboutUs';
import { useNavigate } from 'react-router-dom';

const AboutUsTable = () => {
  const navigate = useNavigate();
  const { data: aboutUsData, isLoading } = useGetAboutUsQuery();
  const [deleteAboutUs] = useDeleteAboutUsMutation();

  const handleDelete = async (id) => {
    try {
      await deleteAboutUs(id);
      message.success('About Us entry deleted successfully');
    } catch (error) {
      message.error('Failed to delete About Us entry');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    },
    {
      title: 'Short Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      ellipsis: true,
      width: '40%',
      render: (shortDescription) => (
        <div dangerouslySetInnerHTML={{ __html: shortDescription }} />
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: '15%',
      render: (image) => (
        <img 
          src={`/api/image/download/${image}`} 
          alt="About Us" 
          style={{ width: '100px', height: '50px', objectFit: 'cover' }} 
        />
      ),
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
            onClick={() => navigate(`/edit-about-us-form/${record._id}`)}
          >
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          >
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ padding: '24px' }} className='flex justify-between items-center'>
        <div className='text-2xl font-bold'>
          <h1>About Us</h1>   
        </div>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/about-us-form')}
            style={{ marginBottom: '16px' }}
          >
            Add About Us
          </Button>
        </div>
      </div>
      <Table 
        columns={columns} 
        dataSource={aboutUsData} 
        loading={isLoading}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
};

export default AboutUsTable;
