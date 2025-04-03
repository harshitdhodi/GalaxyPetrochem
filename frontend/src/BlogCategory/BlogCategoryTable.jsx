'use client'

import React, { useEffect } from 'react'
import { Table, Button, Space, Spin, Popconfirm, message } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '@/slice/blog/blogCategory'

const BlogCategory = () => {
  const navigate = useNavigate()
  const { data: categories, error, isLoading, refetch } = useGetAllCategoriesQuery()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
console.log(categories)
  useEffect(() => {
    refetch()
  }, [refetch])

  const handleEdit = (id) => {
    navigate(`/edit-blog-category-form/${id}`)
  }

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap()
      message.success('Category deleted successfully')
      refetch()
    } catch (error) {
      message.error('Failed to delete category')
    }
  }

  if (isLoading) return <Spin size="large" />

  if (error) return <div>Error: {error.message || 'An error occurred'}</div>

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              loading={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between  p-5 mb-4">
        <div>
          <h2 className='text-2xl font-semibold'>Blog Categories</h2>
        </div>
        <Link to="/blog-category-form">
          <Button type="primary" icon={<PlusOutlined />}>
            Add Category
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={categories || []}
        rowKey="_id"
        bordered
      />
    </div>
  )
}

export default BlogCategory
