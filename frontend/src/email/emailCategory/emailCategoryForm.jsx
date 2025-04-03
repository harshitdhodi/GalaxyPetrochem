import { Form, Input, Modal, message } from 'antd';
import { useCreateEmailCategoryMutation, useUpdateEmailCategoryMutation } from '@/slice/emailCategory/emailCategory';

const EmailCategoryForm = ({ visible, onClose, editingCategory }) => {
    const [form] = Form.useForm();
    const [createCategory] = useCreateEmailCategoryMutation();
    const [updateCategory] = useUpdateEmailCategoryMutation();

    const handleSubmit = async (values) => {
        try {
            if (editingCategory) {
                await updateCategory({
                    id: editingCategory._id,
                    data: values
                }).unwrap();
                message.success('Category updated successfully');
            } else {
                await createCategory(values).unwrap();
                message.success('Category created successfully');
            }
            onClose();
        } catch (error) {
            message.error('Failed to save category');
        }
    };

    return (
        <Modal
            title={editingCategory ? 'Edit Category' : 'Add New Category'}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={editingCategory}
            >
                <Form.Item
                    name="emailCategory"
                    label="Category Name"
                    rules={[
                        { required: true, message: 'Please enter category name' }
                    ]}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EmailCategoryForm;