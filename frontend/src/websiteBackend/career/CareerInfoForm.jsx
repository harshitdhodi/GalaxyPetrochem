import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, message, Image, Breadcrumb, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const { Title } = Typography;

const CareerInfoForm = () => {
  const [form] = Form.useForm();
  const [info, setInfo] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [careerInfo, setCareerInfo] = useState(null);

  const fetchCareerInfo = async () => {
    try {
      const response = await axios.get('/api/careerInfo');
      if (response.data.length > 0) {
        const data = response.data[0];
        setCareerInfo(data);
        setInfo(data.info);
        form.setFieldsValue({ info: data.info });
        if (data.image) {
          setImageUrl(`/api/image/download/${data.image}`);
        }
      }
    } catch (error) {
      console.error('Error fetching career info:', error);
    }
  };

  useEffect(() => {
    fetchCareerInfo();
  }, [form]);

  const handleInfoChange = (newInfo) => {
    setInfo(newInfo);

    // Convert white text to black for visibility
    const parser = new DOMParser();
    const doc = parser.parseFromString(newInfo, 'text/html');
    const elements = doc.getElementsByTagName('*');
    for (let element of elements) {
      if (element.style.color === 'white' || element.style.color === '#ffffff') {
        element.style.color = 'black';
      }
    }
    setInfo(doc.body.innerHTML);
  };

  const handleImageChange = ({ file }) => {
    setImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('info', info);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (careerInfo) {
        await axios.put(`/api/careerInfo/${careerInfo._id}`, formData);
        message.success('Career info updated successfully');
      } else {
        await axios.post('/api/careerInfo', formData);
        message.success('Career info created successfully');
      }
      fetchCareerInfo();
    } catch (error) {
      console.error('Error saving career info:', error);
      message.error('Error saving career info');
    }
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Career Info</Breadcrumb.Item>
      </Breadcrumb>
      <Title level={2} style={{ margin: '16px 0' }}>Career Info</Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Info" name="info" rules={[{ required: true, message: 'Please enter the info' }]}>
          <ReactQuill
            value={info}
            onChange={handleInfoChange}
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ align: [] }],
                ['clean']
              ]
            }}
            formats={[  'header',
              'bold', 'italic', 'underline', 'strike',
              'list', 'bullet']}
          /> 
        </Form.Item>
        <Form.Item label="Image" name="image">
          {imageUrl && <Image width={200} src={imageUrl} alt="Career Info Image" />}
          <Upload beforeUpload={() => false} onChange={handleImageChange} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {careerInfo ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CareerInfoForm;