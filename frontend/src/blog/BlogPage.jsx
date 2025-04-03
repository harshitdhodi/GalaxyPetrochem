import React, { useState } from 'react';
import { Table, Button, Popconfirm, Typography, Image } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllBlogsQuery, useDeleteBlogMutation } from '@/slice/blog/blog';

const { Text } = Typography;

const BlogTable = () => {
  const { data: blogs, error, isLoading, refetch } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message || 'An error occurred'}</div>;

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const toggleDetails = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 150, // Increased width (Adjust as needed)
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 50,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (text, record) => (
        <div>
          <div
            style={{
              maxHeight: expandedRows[record._id] ? 'none' : '5em',
              overflow: 'hidden',
              position: 'relative',
            }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
          <Button
            type="link"
            onClick={() => toggleDetails(record._id)}
            size="small"
          >
            {expandedRows[record._id] ? 'Show Less' : 'Read More'}
          </Button>
        </div>
      ),
    },
    {
      title: 'Images',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (images) =>
        images && images.length > 0 ? (
          images.map((img, index) => (
            <Image
              key={index}
              src={`/api/image/download/${img}`}
              alt={`Blog Image ${index + 1}`}
              width={50}
              height={50}
              style={{ objectFit: 'cover', borderRadius: '5px' }}
            />
          ))
        ) : (
          <Text type="secondary">No Image</Text>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-blog-form/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure you want to delete this blog?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4 p-5">
        <div>
          <h2 className='text-2xl font-semibold'>Blogs</h2>
        </div>
        <Link to="/blog-form">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Blog
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={blogs}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default BlogTable;
