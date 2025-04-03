import React, { useState, useEffect } from 'react';
import { Form, Button, message, Breadcrumb } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const TermsConditionForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [termsCondition, setTermsCondition] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isExistingData, setIsExistingData] = useState(false);
  const [termsConditionId, setTermsConditionId] = useState(null);

  useEffect(() => {
    const fetchTermsConditionData = async () => {
      try {
        const response = await axios.get('/api/terms');
        if (response.data.length > 0) {
          const termsConditionData = response.data[0]; // Assuming the API returns an array with one object
          setTermsCondition(termsConditionData.termsCondition);
          setTermsConditionId(termsConditionData._id);
          form.setFieldsValue({
            termsCondition: termsConditionData.termsCondition,
          });
          setIsExistingData(true);
        }
      } catch (error) {
        message.error('Failed to fetch terms and conditions data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermsConditionData();
  }, [form]);

  const handleFinish = async () => {
    try {
      if (isExistingData) {
        await axios.put(`/api/terms/${termsConditionId}`, { termsCondition });
        message.success('Terms and conditions data updated successfully');
      } else {
        await axios.post('/api/terms/add', { termsCondition });
        message.success('Terms and conditions data created successfully');
      }
      // navigate('/termscondition');
    } catch (error) {
      message.error('Failed to save terms and conditions data');
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Terms and Conditions Form</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item 
          name="termsCondition" 
          label="Terms and Conditions" 
          rules={[{ required: true, message: 'Please enter the terms and conditions' }]}
        >
          <ReactQuill 
            theme="snow" 
            value={termsCondition} 
            onChange={setTermsCondition} 
          />
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

export default TermsConditionForm;