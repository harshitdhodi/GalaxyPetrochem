import { useState } from 'react';
import { Card, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EmailCategoryTable from './EmailCategory';
import EmailCategoryForm from './emailCategoryForm';

const EmailCategoryParent = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalVisible(true);
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    return (
        <Card title="Email Categories">
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddNew}
                style={{ marginBottom: 16 }}
            >
                Add New Category
            </Button>

            <EmailCategoryTable onEditClick={handleEditClick} />

            {isModalVisible && (
                <EmailCategoryForm
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    editingCategory={editingCategory}
                />
            )}
        </Card>
    );
};

export default EmailCategoryParent;