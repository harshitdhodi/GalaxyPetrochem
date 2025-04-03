import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message, Breadcrumb, Spin, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  useCreateAboutUsMutation, 
  useUpdateAboutUsMutation,
  useGetAboutUsByIdQuery 
} from '../../slice/aboutUs/aboutUs';
import { useNavigate, useParams } from 'react-router-dom';

const AboutUsForm = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [autoSlug, setAutoSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  // Fetch data if ID exists
  const { 
    data: aboutUsData, 
    isLoading: isLoadingData 
  } = useGetAboutUsByIdQuery(id);

  const [createAboutUs] = useCreateAboutUsMutation();
  const [updateAboutUs] = useUpdateAboutUsMutation();

  // Set form values when data is fetched
  useEffect(() => {
    if (aboutUsData) {
      form.setFieldsValue({
        title: aboutUsData.title,
        shortDescription: aboutUsData.shortDescription,
        description: aboutUsData.description,
        imageTitle: aboutUsData.imageTitle,
        altName: aboutUsData.altName,
        section: aboutUsData.section,
        slug: aboutUsData.slug,
      });
      setAutoSlug(aboutUsData.slug);
      setIsCustomSlug(aboutUsData.slug !== aboutUsData.section.toLowerCase().replace(/\s+/g, '-'));

      // Set existing image
      if (aboutUsData.image) {
        setFileList([{
          uid: '-1',
          name: 'Current Image',
          status: 'done',
          url: `/api/image/download/${aboutUsData.image}`,
        }]);
      }
    }
  }, [aboutUsData, form]);

  // Add this effect to auto-generate slug when section changes
  useEffect(() => {
    const sectionValue = form.getFieldValue('section');
    if (sectionValue && !isCustomSlug) {
      const generatedSlug = sectionValue.toLowerCase().replace(/\s+/g, '-');
      setAutoSlug(generatedSlug);
      form.setFieldsValue({ slug: generatedSlug });
    }
  }, [form.getFieldValue('section'), isCustomSlug]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': ['', 'center', 'right', 'justify'] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('shortDescription', values.shortDescription);
      formData.append('description', values.description);
      formData.append('imageTitle', values.imageTitle);
      formData.append('altName', values.altName);
      formData.append('section', values.section);
      formData.append('slug', values.slug);
      
      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      if (id) {
        await updateAboutUs({ id, formData }).unwrap();
        message.success('About Us updated successfully');
      } else {
        await createAboutUs(formData).unwrap();
        message.success('About Us created successfully');
      }

      navigate('/about-us-table');
    } catch (error) {
      const errorMessage = error.data?.error || `Failed to ${id ? 'update' : 'create'} About Us entry`;
      message.error(errorMessage);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      return false;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    fileList,
  };

  if (isLoadingData && id) {
    return <Spin size="large" />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { title: 'Dashboard', onClick: () => navigate('/dashboard') },
          { title: 'About Us', onClick: () => navigate('/about-us-table') },
          { title: id ? 'Edit About Us' : 'Create About Us' },
        ]}
        style={{ marginBottom: '1rem' }}
      />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="section"
          label="Section"
          rules={[{ required: true, message: 'Please select a section!' }]}
        >
          <Select 
            placeholder="Select a section"
            onChange={(value) => {
              if (!isCustomSlug) {
                const newSlug = value.toLowerCase().replace(/\s+/g, '-');
                setAutoSlug(newSlug);
                form.setFieldsValue({ slug: newSlug });
              }
            }}
          >
            <Select.Option value="Introduction">Introduction</Select.Option>
            <Select.Option value="Mission Vision">Mission Vision</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="slug"
          label={
            <span>
              Slug
              <Button 
                type="link" 
                size="small" 
                onClick={() => {
                  setIsCustomSlug(!isCustomSlug);
                  if (!isCustomSlug) {
                    // If switching to custom, keep current value
                    const currentSlug = form.getFieldValue('slug');
                    setAutoSlug(currentSlug);
                  } else {
                    // If switching back to auto, regenerate from section
                    const sectionValue = form.getFieldValue('section');
                    const newSlug = sectionValue.toLowerCase().replace(/\s+/g, '-');
                    setAutoSlug(newSlug);
                    form.setFieldsValue({ slug: newSlug });
                  }
                }}
                style={{ marginLeft: 8 }}
              >
                {isCustomSlug ? 'Use Auto Slug' : 'Customize Slug'}
              </Button>
            </span>
          }
          rules={[
            { required: true, message: 'Slug is required!' },
            {
              pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: 'Slug can only contain lowercase letters, numbers, and hyphens'
            }
          ]}
        >
          <Input 
            disabled={!isCustomSlug}
            onChange={(e) => {
              if (isCustomSlug) {
                setAutoSlug(e.target.value);
              }
            }}
          />
        </Form.Item>

        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: false, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="shortDescription"
          label="Short Description"
          rules={[{ required: false, message: 'Please input the short description!' }]}
        >
          <ReactQuill 
            modules={modules}
            theme="snow"
            style={{ height: '150px', marginBottom: '50px' }}
            className="custom-quill-editor"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: false, message: 'Please input the description!' }]}
        >
          <ReactQuill 
            modules={modules}
            theme="snow"
            style={{ height: '600px', marginBottom: '50px' }}
            className="custom-quill-editor"
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Image"
          rules={[{ required: false, message: 'Please upload an image!' }]}
        >
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>
              {id ? 'Change Image' : 'Click to Upload'}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="imageTitle"
          label="Image Title"
          rules={[{ required: false, message: 'Please input the image title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="altName"
          label="Alt Name"
          rules={[{ required: false, message: 'Please input the alt name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? 'Update' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AboutUsForm;
