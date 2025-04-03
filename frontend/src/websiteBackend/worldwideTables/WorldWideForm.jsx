import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Card, Breadcrumb, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    useCreateWorldwideMutation,
    useUpdateWorldwideMutation,
    useGetWorldwideByIdQuery
} from '../../slice/worldwide/worldwide';

const { Option } = Select;

const WorldwideForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [createWorldwide] = useCreateWorldwideMutation();
    const [updateWorldwide] = useUpdateWorldwideMutation();
    const { data: editData, isLoading: isLoadingEdit } = useGetWorldwideByIdQuery(id, {
        skip: !isEditMode
    });

    // Set form values when editing
    useEffect(() => {
        if (isEditMode && editData?.data) {
            form.setFieldsValue(editData.data);
        }
    }, [editData, form, isEditMode]);

    const onFinish = async (values) => {
        try {
            if (isEditMode) {
                await updateWorldwide({ id, data: values }).unwrap();
                message.success('Location updated successfully!');
            } else {
                await createWorldwide(values).unwrap();
                message.success('Location added successfully!');
            }
            navigate('/worldwide-table');
        } catch (error) {
            message.error(error.message || 'Something went wrong');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Breadcrumb
                items={[
                    { 
                        title: <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                            Dashboard
                        </span>
                    },
                    { 
                        title: <span onClick={() => navigate('/worldwide-table')} style={{ cursor: 'pointer' }}>
                            Worldwide Locations
                        </span>
                    },
                    { title: isEditMode ? 'Edit Location' : 'Add Location' }
                ]}
                style={{ marginBottom: '16px' }}
            />

            <Card title={isEditMode ? 'Edit Location' : 'Add New Location'}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ category: 'international' }}
                >
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select>
                            <Option value="international">International</Option>
                            <Option value="india">India</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Country Name"
                        rules={[{ required: true, message: 'Please enter country name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => 
                            prevValues.category !== currentValues.category
                        }
                    >
                        {({ getFieldValue }) => 
                            getFieldValue('category') === 'india' && (
                                <>
                                    <Form.Item
                                        name="state"
                                        label="State"
                                        rules={[{ required: true, message: 'Please enter state' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="cities"
                                        label="Cities (Enter up to 5 cities, one per line)"
                                        rules={[{ required: true, message: 'Please enter at least one city' }]}
                                    >
                                        <Input.TextArea 
                                            rows={5}
                                            placeholder="Enter cities, one per line"
                                            onChange={(e) => {
                                                const cities = e.target.value.split('\n').slice(0, 5);
                                                form.setFieldsValue({ cities });
                                            }}
                                        />
                                    </Form.Item>
                                </>
                            )
                        }
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoadingEdit}>
                            {isEditMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button 
                            style={{ marginLeft: '10px' }}
                            onClick={() => navigate('/worldwide-table')}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default WorldwideForm;
