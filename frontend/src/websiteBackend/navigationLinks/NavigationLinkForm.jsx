import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCreateNavigationLinkMutation, useUpdateNavigationLinkMutation, useGetNavigationLinkByIdQuery } from '@/slice/navigationLink/navigationSlice';

const NavigationLinkForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: navigationLink, isLoading: isFetching, refetch } = useGetNavigationLinkByIdQuery(id, { skip: !id });
  const [createNavigationLink] = useCreateNavigationLinkMutation();
  const [updateNavigationLink] = useUpdateNavigationLinkMutation();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (navigationLink) {
      form.setFieldsValue(navigationLink);
      setFileList([{ url: `/api/logo/download/${navigationLink.icon}`, name: navigationLink.icon }]);
    }
  }, [navigationLink, form]);

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if (fileList[0]?.originFileObj) {
      formData.append('icon', fileList[0].originFileObj);
    }
  
    try {
      if (id) {
        await updateNavigationLink({ id, formData }).unwrap();
        message.success('Navigation link updated successfully');
        await refetch(); // 🔥 Force data refresh after update
      } else {
        await createNavigationLink(formData).unwrap();
        message.success('Navigation link created successfully');
      }
      navigate('/navigationLink'); 
    } catch (error) {
      message.error('Failed to save navigation link');
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  return (
    <>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/navigationLink">Navigation Links</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{id ? 'Edit Navigation Link' : 'Add Navigation Link'}</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="icon" label="Icon" rules={[{ required: true, message: 'Please upload an icon' }]}>
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Upload Icon</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isFetching}>
            {id ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default NavigationLinkForm;