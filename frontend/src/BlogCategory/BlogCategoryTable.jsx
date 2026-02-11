'use client'

import React, { useEffect } from 'react'
import { Table, Button, Space, Spin, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '@/slice/blog/blogCategory'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
      toast.success('Category deleted successfully', {
        position: 'top-right',
        autoClose: 4000,
      })
      refetch()
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.error || 'Failed to delete category'
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      })
    }
  }

  if (isLoading) return <Spin size="large" />

  if (error)
    return (
      <div className="text-red-600 p-4">
        Error: {error?.data?.message || error?.error || 'An error occurred'}
      </div>
    )

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
            title="Delete Category"
            description="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              disabled={isDeleting}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Don't forget to add ToastContainer somewhere in your app (preferably in root) */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Blog Categories</h2>
        <Link to="/blog-category-form">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Add New Category
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={categories || []}
        rowKey="_id"
        bordered
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />
    </div>
  )
}

export default BlogCategory