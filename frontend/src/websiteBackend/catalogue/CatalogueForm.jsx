import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Breadcrumb } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useCreateCatalogueMutation, 
     useGetCatalogueByIdQuery, useUpdateCatalogueMutation } from "@/slice/catalogue/catalogueslice";
import { useNavigate, useParams, Link } from 'react-router-dom';

const CatalogueForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: catalogue, isLoading: isFetching } = useGetCatalogueByIdQuery(id, { skip: !id });
  const [createCatalogue] = useCreateCatalogueMutation();
  const [updateCatalogue] = useUpdateCatalogueMutation();
  const [fileList, setFileList] = useState([]);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (catalogue) {
      form.setFieldsValue(catalogue);
      setFileList([{ url: `/api/image/pdf/view/${catalogue.catalogue}`, name: catalogue.catalogue }]);
      setImageList([{ url: `/api/image/view/${catalogue.image}`, name: catalogue.image }]);
    }
  }, [catalogue, form]);

  const handleFinish = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    if (fileList[0]?.originFileObj) {
      formData.append('catalog', fileList[0].originFileObj); // Updated field name to 'catalog'
    }
    if (imageList[0]?.originFileObj) {
      formData.append('image', imageList[0].originFileObj); // Added field name 'image'
    }

    try {
      if (id) {
        await updateCatalogue({ id, formData }).unwrap();
        message.success('Catalogue updated successfully');
      } else {
        await createCatalogue(formData).unwrap();
        message.success('Catalogue created successfully');
      }
      navigate('/catalogue-table');
    } catch (error) {
      message.error('Failed to save catalogue');
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);
  const handleImageChange = ({ fileList }) => setImageList(fileList);

  return (
    <>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/catalogue-table">Catalogue Table</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{id ? 'Edit Catalogue' : 'Create Catalogue'}</Breadcrumb.Item>
      </Breadcrumb>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="catalogue" label="Catalogue" rules={[{ required: true, message: 'Please upload a catalogue' }]}>
          <Upload
            listType="picture"
            maxCount={1}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Upload Catalogue</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="image" label="Image" rules={[{ required: true, message: 'Please upload an image' }]}>
          <Upload
            listType="picture"
            maxCount={1}
            fileList={imageList}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
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

export default CatalogueForm;