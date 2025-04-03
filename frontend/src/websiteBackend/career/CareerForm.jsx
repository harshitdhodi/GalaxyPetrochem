import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Breadcrumb, message, Upload } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { 
    useSubmitApplicationMutation,
    useUpdateApplicationMutation,
    useGetApplicationByIdQuery
} from '../../slice/career/CareerForm';

const CareerAdminForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [fileList, setFileList] = useState([]);

    // API hooks
    const [submitApplication] = useSubmitApplicationMutation();
    const [updateApplication] = useUpdateApplicationMutation();
    const { data: editData, isLoading: isLoadingEdit } = useGetApplicationByIdQuery(id, {
        skip: !isEditMode
    });

    // Set form values when editing
    useEffect(() => {
        if (isEditMode && editData?.data) {
            form.setFieldsValue({
                name: editData.data.name,
                email: editData.data.email,
                contactNo: editData.data.contactNo,
                address: editData.data.address,
                postAppliedFor: editData.data.postAppliedFor,
            });
            
            // Set existing resume file
            if (editData.data.resumeFile) {
                setFileList([
                    {
                        uid: '-1',
                        name: editData.data.resumeFile.split('/').pop(),
                        status: 'done',
                        url: editData.data.resumeFile,
                    }
                ]);
            }
        }
    }, [editData, form, isEditMode]);

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('contactNo', values.contactNo);
            formData.append('address', values.address);
            formData.append('postAppliedFor', values.postAppliedFor);

            // Only append file if a new one is uploaded
            if (fileList[0]?.originFileObj) {
                formData.append('resumeFile', fileList[0].originFileObj);
            }

            if (isEditMode) {
                await updateApplication({ id, formData }).unwrap();
                message.success('Application updated successfully!');
            } else {
                await submitApplication(formData).unwrap();
                message.success('Application submitted successfully!');
            }
            navigate('/career-table');
        } catch (error) {
            message.error(error.message || 'Something went wrong');
        }
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('You can only upload PDF files!');
                return false;
            }
            return false; // Prevent automatic upload
        },
        maxCount: 1,
        fileList,
        onChange: handleFileChange,
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
                        title: <span onClick={() => navigate('/career-table')} style={{ cursor: 'pointer' }}>
                            Career Applications
                        </span>
                    },
                    { title: isEditMode ? 'Edit Application' : 'Add Application' }
                ]}
                style={{ marginBottom: '16px' }}
            />

            <Card title={isEditMode ? 'Edit Application' : 'Add New Application'}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    disabled={isLoadingEdit}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: 'Please enter name' },
                            { min: 2, message: 'Name must be at least 2 characters' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="contactNo"
                        label="Contact Number"
                        rules={[
                            { required: true, message: 'Please enter contact number' },
                            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number' }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            { required: true, message: 'Please enter address' },
                            { min: 5, message: 'Address must be at least 5 characters' }
                        ]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="postAppliedFor"
                        label="Post Applied For"
                        rules={[{ required: true, message: 'Please enter post applied for' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="resumeFile"
                        label="Resume"
                        rules={[
                            { 
                                required: !isEditMode && !fileList.length, 
                                message: 'Please upload resume' 
                            }
                        ]}
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                                {fileList.length ? 'Replace Resume' : 'Upload Resume'}
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoadingEdit}>
                            {isEditMode ? 'Update' : 'Submit'}
                        </Button>
                        <Button 
                            style={{ marginLeft: '10px' }}
                            onClick={() => navigate('/career-table')}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CareerAdminForm; 