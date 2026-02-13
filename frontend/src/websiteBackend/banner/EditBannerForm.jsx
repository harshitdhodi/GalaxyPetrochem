import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload, Select, Breadcrumb } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBannerByIdQuery, useUpdateBannerMutation, useGetAllBannersQuery } from '../../slice/banner/banner';
import JoditEditor from 'jodit-react'; // Import JoditReact
import { UploadOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const EditBannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [imageChanged, setImageChanged] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const { data: banner, isLoading, refetch } = useGetBannerByIdQuery(id);
  const [updateBanner] = useUpdateBannerMutation();
  const { refetch: refetchAllBanners } = useGetAllBannersQuery();

  // File size limit in bytes (1MB = 1024 * 1024 bytes)
  const MAX_FILE_SIZE = 1024 * 1024; // 1MB

  // Jodit Editor configuration
  const editorConfig = {
    readonly: false,
    placeholder: 'Enter details...',
    height: 400,
    toolbarAdaptive: false,
    buttons: [
      'bold',
      'italic',
      'underline',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'image',
      'table',
      'link',
      '|',
      'align',
      'undo',
      'redo',
      '|',
      'hr',
      'eraser',
      'copyformat',
      '|',
      'fullsize',
      'print',
    ],
  };

  useEffect(() => {
    // Fetch menu list for pageSlug dropdown
    const fetchMenuList = async () => {
      try {
        const response = await axios.get('/api/menulist/get-menu');
        if (response.data.success) {
          setMenuList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching menu list:', error);
        message.error('Failed to fetch menu list');
      }
    };
    fetchMenuList();
  }, []);

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        altName: banner.altName,
        details: banner.details,
        imgName: banner.imgName,
        pageSlug: banner.pageSlug || '',
        image: banner.image
          ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
          : [],
        photo: banner.photo
          ? [{ name: banner.photoName, url: `/api/image/download/${banner.photo}` }]
          : [],
      });
    }
  }, [banner, form]);

  const beforeUploadImage = (file) => {
    const isLt1M = file.size <= MAX_FILE_SIZE;
    if (!isLt1M) {
      message.error('Image must be smaller than 1MB!');
      return Upload.LIST_IGNORE; // Prevent upload
    }
    return false; // Prevent auto upload
  };

  const beforeUploadPhoto = (file) => {
    const isLt1M = file.size <= MAX_FILE_SIZE;
    if (!isLt1M) {
      message.error('Photo must be smaller than 1MB!');
      return Upload.LIST_IGNORE; // Prevent upload
    }
    return false; // Prevent auto upload
  };

  const handleImageChange = (info) => {
    const file = info.fileList[0];
    
    // Check file size
    if (file?.originFileObj && file.size > MAX_FILE_SIZE) {
      return;
    }

    setImageChanged(true);
    form.setFieldsValue({
      imgName: info.file?.name || '',
      image: info.fileList,
    });
  };

  const handlePhotoChange = (info) => {
    const file = info.fileList[0];
    
    // Check file size
    if (file?.originFileObj && file.size > MAX_FILE_SIZE) {
      return;
    }

    setPhotoChanged(true);
    form.setFieldsValue({
      photo: info.fileList,
    });
  };

  const onFinish = async (values) => {
    try {
      if (!values.title?.trim()) {
        message.error('Title is required');
        return;
      }
      if (!values.altName?.trim()) {
        message.error('Alt Name is required');
        return;
      }
      if (!values.pageSlug) {
        message.error('Page Slug is required');
        return;
      }

      const formData = new FormData();

      if (imageChanged && values.image?.[0]?.originFileObj) {
        formData.append('image', values.image[0].originFileObj);
        formData.append('imgName', values.image[0].name);
      } else {
        formData.append('imgName', values.imgName || banner.imgName);
      }

      if (photoChanged && values.photo?.[0]?.originFileObj) {
        formData.append('photo', values.photo[0].originFileObj);
      } else if (banner.photo) {
        formData.append('photo', banner.photo);
      }

      formData.append('title', values.title.trim());
      formData.append('altName', values.altName.trim());
      formData.append('details', values.details?.trim() || '');
      formData.append('pageSlug', values.pageSlug);

      await updateBanner({
        id,
        bannerData: formData,
      });

      message.success('Banner updated successfully');
      refetch();
      refetchAllBanners();
      navigate('/banner-table');
    } catch (error) {
      console.error(error);
      message.error('Failed to update banner');
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
        <Breadcrumb.Item>Edit Banner</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ padding: '24px' }}>
        <h1 className="text-2xl font-bold mb-6">Edit Banner</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: banner?.title || '',
            altName: banner?.altName || '',
            details: banner?.details || '',
            imgName: banner?.imgName || '',
            pageSlug: banner?.pageSlug || '',
            image: banner?.image
              ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
              : [],
            photo: banner?.photo
              ? [{ name: banner.photoName, url: `/api/photo/download/${banner.photo}` }]
              : [],
          }}
        >
          <Form.Item
            name="pageSlug"
            label="Page Slug"
            rules={[{ required: true, message: 'Please select a Page Slug!' }]}
          >
            <Select placeholder="Select Page Slug">
              {menuList.map((menu) => (
                <Option key={menu._id} value={menu.parent.path}>
                  {menu.parent.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Banner Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
            extra="Image size must be 1MB or less"
          >
            <Upload
              maxCount={1}
              listType="picture"
              beforeUpload={beforeUploadImage}
              onChange={handleImageChange}
              defaultFileList={
                banner?.image
                  ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>
                {imageChanged ? 'Change Image (Max 1MB)' : 'Upload New Image (Max 1MB)'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="photo"
            label="Photo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
            extra="Photo size must be 1MB or less"
          >
            <Upload
              maxCount={1}
              listType="picture"
              beforeUpload={beforeUploadPhoto}
              onChange={handlePhotoChange}
              defaultFileList={
                banner?.photo
                  ? [{ name: banner.photoName, url: `/api/photo/download/${banner.photo}` }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>
                {photoChanged ? 'Change Photo (Max 1MB)' : 'Upload New Photo (Max 1MB)'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="imgName"
            label="Image Name"
            rules={[{ required: true, message: 'Please input image name!' }]}
          >
            <Input disabled={imageChanged} />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="altName"
            label="Alt Name"
            rules={[{ required: true, message: 'Please input alt name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="details"
            label="Details"
            rules={[{ message: 'Please input details!' }]}
          >
            <JoditEditor
              value={form.getFieldValue('details') || ''} // Set initial value
              config={editorConfig}
              onBlur={(newContent) => form.setFieldsValue({ details: newContent })} // Update form on content change
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditBannerForm;