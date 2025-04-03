import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Breadcrumb } from 'antd';
import { useGetWhatsUpInfoQuery, useUpdateWhatsUpInfoByIdMutation } from '@/slice/whatsUpInfo/WhatsUpInfo';

const WhatsUpInfoForm = ({ onClose }) => {
    const [form] = Form.useForm();
    const { data: whatsUpInfo, isLoading, refetch } = useGetWhatsUpInfoQuery();
    const [updateWhatsUpInfoById, { isLoading: isUpdating }] = useUpdateWhatsUpInfoByIdMutation();
    const [initialValues, setInitialValues] = useState(null);

    useEffect(() => {
        if (whatsUpInfo && whatsUpInfo.length > 0) {
            form.setFieldsValue(whatsUpInfo[0]);
            setInitialValues(whatsUpInfo[0]);
        }
    }, [whatsUpInfo, form]);

    const onFinish = async (values) => {
        try {
            console.log('Updating WhatsUp Info with values:', values);

            if (!initialValues || !initialValues._id) {
                throw new Error("Invalid initialValues: Missing _id");
            }

            await updateWhatsUpInfoById({ id: initialValues._id, ...values }).unwrap();
            await refetch();
            message.success('WhatsUp Info updated successfully!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.log('Failed to save WhatsUp Info:', error);
            console.log(error.message || 'Failed to update WhatsUp Info.');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Breadcrumb className='mb-5'>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>WhatsUp Info</Breadcrumb.Item>
                
            </Breadcrumb>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onFinish}
            >
                <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please input the message!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    name="number"
                    label="Number"
                    rules={[
                        { required: true, message: 'Please input the number!' },
                        { pattern: /^[0-9]+$/, message: 'Number must contain only digits!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isUpdating}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default WhatsUpInfoForm;