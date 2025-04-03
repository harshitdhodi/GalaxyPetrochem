import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Upload, Select, Breadcrumb } from 'antd';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetBannerByIdQuery, useUpdateBannerMutation } from '../../slice/banner/banner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
                    ? [{ name: banner.photoName, url: `/api/photo/download/${banner.photo}` }]
                    : [],
            });
        }
    }, [banner, form]);

    const handleImageChange = (info) => {
        setImageChanged(true);
        form.setFieldsValue({
            imgName: info.file.name,
            image: info.fileList,
        });
    };

    const handlePhotoChange = (info) => {
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
            refetch(); // Refetch the banner data to get the updated data
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
                            ? [{ name: banner.photoName, url: `/api/image/download/${banner.photo}` }]
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

                    <Form.Item name="image" label="Banner Image" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                        <Upload
                            maxCount={1}
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            defaultFileList={
                                banner?.image
                                    ? [{ name: banner.imgName, url: `/api/image/download/${banner.image}` }]
                                    : []
                            }
                        >
                            <Button icon={<UploadOutlined />}>
                                {imageChanged ? 'Change Image' : 'Upload New Image'}
                            </Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item name="photo" label="Photo" valuePropName="fileList" getValueFromEvent={(e) => e && e.fileList}>
                        <Upload
                            maxCount={1}
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handlePhotoChange}
                            defaultFileList={
                                banner?.photo
                                    ? [{ name: banner.photoName, url: `/api/photo/download/${banner.photo}` }]
                                    : []
                            }
                        >
                            <Button icon={<UploadOutlined />}>
                                {photoChanged ? 'Change Photo' : 'Upload New Photo'}
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
                        <ReactQuill theme="snow" />
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