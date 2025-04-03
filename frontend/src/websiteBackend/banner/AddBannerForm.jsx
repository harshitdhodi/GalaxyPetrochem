import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload, Breadcrumb, Select } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateBannerMutation } from '../../slice/banner/banner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AddBannerForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createBanner] = useCreateBannerMutation();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuList = async () => {
      try {
        const response = await axios.get('/api/menulist/get-menu');
        if (response.data.success) {
          setMenuList(response.data.data);
        } else {
          message.error('Failed to load menu list');
        }
      } catch (error) {
        console.error('Error fetching menu list:', error);
        message.error('Error fetching menu list');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuList();
  }, []);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      if (values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
        formData.append('imgName', values.imgName); // Use the manually entered imgName
      } else {
        message.error('Please select an image');
        return;
      }

      if (values.photo?.[0]?.originFileObj) {
        formData.append('photo', values.photo[0].originFileObj);
      } else {
        message.error('Please select a photo');
        return;
      }

      formData.append('title', values.title);
      formData.append('altName', values.altName);
      formData.append('details', values.details);
      formData.append('pageSlug', values.pageSlug);

      await createBanner(formData);
      message.success('Banner created successfully');
      navigate('/banner-table');
    } catch (error) {
      console.error(error);
      message.error('Failed to create banner');
    }
  };

  const handleImageChange = (info) => {
    const file = info.fileList[0];
    if (file?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file.originFileObj);

      // Only set the image field, not imgName
      form.setFieldsValue({
        image: info.fileList,
      });
    } else {
      setPreviewUrl(null);
    }
  };

  const handlePhotoChange = (info) => {
    const file = info.fileList[0];
    if (file?.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file.originFileObj);

      // Only set the photo field
      form.setFieldsValue({
        photo: info.fileList,
      });
    } else {
      setPreviewUrl(null);
    }
  };

  const renderMenuOptions = (menu) => {
    return (
      <React.Fragment key={menu._id}>
        <Option value={menu.parent.path} style={{ fontWeight: "bold" }}>
          {menu.parent.name}
        </Option>
        {menu.children.map((child) => (
          <React.Fragment key={child._id}>
            <Option value={child.path} style={{ paddingLeft: 20 }}>
              <span> ├── </span>{child.name}
            </Option>
            {child.subChildren.map((subChild) => (
              <Option key={subChild._id} value={subChild.path} style={{ paddingLeft: 40 }}>
                <span>├────</span> {subChild.name}
              </Option>
            ))}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  };

  return (
    <div>
      <Breadcrumb style={{ padding: '16px 24px' }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/banner-table">Banner Management</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Add New Banner</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ padding: '24px' }}>
        <h1 className="text-2xl font-bold mb-6">Add New Banner</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="pageSlug" label="Page Slug" rules={[{ required: true, message: 'Please select a page slug!' }]}>
            <Select placeholder="Select a menu item" loading={loading}>
              {menuList.map(menu => renderMenuOptions(menu))}
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Banner Image" rules={[{ required: true, message: 'Please upload an image!' }]}>
            <Upload maxCount={1} listType="picture" beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="photo" label="Photo" rules={[{ required: true, message: 'Please upload a photo!' }]}>
            <Upload maxCount={1} listType="picture" beforeUpload={() => false} onChange={handlePhotoChange}>
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="imgName" label="Image Name" rules={[{ required: true, message: 'Please input image name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>

          <Form.Item name="altName" label="Alt Name" rules={[{ required: true, message: 'Please input alt name!' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="details" label="Details">
            <ReactQuill theme="snow" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddBannerForm;