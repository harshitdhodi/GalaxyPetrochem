import React, { useState, useEffect } from 'react';
import { Form, Button, message, Breadcrumb } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const PrivacyForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [privacyId, setPrivacyId] = useState(null);

  useEffect(() => {
    const fetchPrivacyData = async () => {
      try {
        const response = await axios.get('/api/privacy');
        if (response.data.length > 0) {
          const privacyData = response.data[0];
          setPrivacyPolicy(privacyData.privacyPolicy);
          setPrivacyId(privacyData._id);
          form.setFieldsValue({
            privacyPolicy: privacyData.privacyPolicy,
          });
          setIsExistingData(true);
        }
      } catch (error) {
        message.error('Failed to fetch privacy data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrivacyData();
  }, [form]);

  const handleFinish = async () => {
    try {
      if (isExistingData) {
        await axios.put(`/api/privacy/${privacyId}`, { privacyPolicy });
        message.success('Privacy data updated successfully');
      } else {
        await axios.post('/api/privacy/add', { privacyPolicy });
        message.success('Privacy data created successfully');
      }
      navigate('/privacypolicy-terms');
    } catch (error) {
      message.error('Failed to save privacy data');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Privacy Form</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="privacyPolicy" label="Privacy Policy" rules={[{ required: true, message: 'Please enter the privacy policy' }]}>
          <ReactQuill theme="snow" value={privacyPolicy} onChange={setPrivacyPolicy} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PrivacyForm;