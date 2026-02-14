import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload, Select, Breadcrumb } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBannerByIdQuery, useUpdateBannerMutation, useGetAllBannersQuery } from '../../slice/banner/banner';
import JoditEditor from 'jodit-react';
import { UploadOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const EditBannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const pageSlug = Form.useWatch('pageSlug', form);
  const [imageChanged, setImageChanged] = useState(false);
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
        title: banner.title === 'undefined' || !banner.title ? 'No Title' : banner.title,
        altName: banner.altName,
        details: banner.details === 'undefined' || !banner.details ? '' : banner.details,
        imgName: banner.imgName,
        pageSlug: banner.pageSlug || '',
        image: banner.image
          ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
          : [],
      });
    }
  }, [banner, form]);

  const beforeUploadImage = (file) => {
    const isLt1M = file.size <= MAX_FILE_SIZE;
    if (!isLt1M) {
      message.error('Image must be smaller than 1MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleImageChange = (info) => {
    setImageChanged(true);
    form.setFieldsValue({
      imgName: info.file?.name || '',
      image: info.fileList,
    });
  };

  const onFinish = async (values) => {
    // Final validation before submission
    if (values.image?.[0]?.originFileObj && values.image[0].originFileObj.size > MAX_FILE_SIZE) {
      message.error('Banner Image is too large! Must be 1MB or less.');
      return;
    }

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

      formData.append('title', values.title.trim());
      formData.append('altName', values.altName.trim());
      formData.append('details', values.details?.trim() || '');
      formData.append('pageSlug', values.pageSlug);

      await updateBanner({
        id,
        bannerData: formData,
      }).unwrap();

      message.success('Banner updated successfully');
      refetch();
      refetchAllBanners();
      navigate('/banner-table');
    } catch (error) {
      console.error('Error updating banner:', error);
      message.error(error.data?.message || 'Failed to update banner');
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
              value={form.getFieldValue('details') || ''}
              config={editorConfig}
              onBlur={(newContent) => form.setFieldsValue({ details: newContent })}
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