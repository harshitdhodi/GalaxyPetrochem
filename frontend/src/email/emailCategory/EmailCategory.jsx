import { useGetEmailCategoriesQuery, useDeleteEmailCategoryMutation } from '@/slice/emailCategory/emailCategory';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const EmailCategoryTable = ({ onEditClick }) => {
    const { data: categories, isLoading } = useGetEmailCategoriesQuery();
    const [deleteCategory] = useDeleteEmailCategoryMutation();

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id).unwrap();
            message.success('Category deleted successfully');
        } catch (error) {
            message.error('Failed to delete category');
        }
    };

    const columns = [
        {
            title: 'Category Name',
            dataIndex: 'emailCategory',
            key: 'emailCategory',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={() => onEditClick(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="primary" 
                            danger 
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            loading={isLoading}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
            }}
        />
    );
};

export default EmailCategoryTable;
