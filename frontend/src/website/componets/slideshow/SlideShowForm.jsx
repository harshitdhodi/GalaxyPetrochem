import React, { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Card, Breadcrumb } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const ImageUploadForm = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [preview, setPreview] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const isEditMode = !!id;

  // Fetch existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchSlideShowData();
    }
  }, [isEditMode]);

  const fetchSlideShowData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/slideShow/getById?id=${id}`);
      const slideShowData = response.data;

      // Set form values
      form.setFieldsValue({
        title: slideShowData.title,
        altText: slideShowData.altText,
      });

      // Set preview if image exists
      if (slideShowData.image) {
        setPreview(`/api/logo/download/${slideShowData.image}`);
      }
    } catch (error) {
      message.error("Failed to fetch slide show data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();

    if (fileList.length > 0) {
      formData.append("image", fileList[0].originFileObj);
    } else if (!isEditMode) {
      message.error("Please upload an image.");
      return;
    }

    formData.append("altText", values.altText);
    formData.append("title", values.title);

    if (isEditMode) {
      formData.append("id", id);
    }

    setLoading(true);
    try {
      let response;

      if (isEditMode) {
        response = await axios.put(`/api/slideShow/update?id=${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Image updated successfully!");
      } else {
        response = await axios.post("/api/slideShow/addimages", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Image uploaded successfully!");
      }

      navigate("/slideShow-table");
    } catch (error) {
      message.error(isEditMode ? "Failed to update image." : "Failed to upload image.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1));

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;

      // Revoke previous object URL to free memory
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else if (!isEditMode) {
      setPreview(null);
    }
  };

  return (
    <div className="flex flex-col items-center px-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="self-start mb-4 text-gray-600">
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/slideShow-table">SlideShow Table</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{isEditMode ? "Edit" : "Upload"} Image</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="w-full max-w-4lg shadow-lg rounded-xl">
        <h2 className="text-xl font-semibold text-left mb-4">
          {isEditMode ? "Edit" : "Upload"} Image
        </h2>
        <Form 
          form={form}
          layout="vertical" 
          onFinish={onFinish} 
          className="w-full lg:w-1/2"
        >
          <Form.Item
            label="Image Title"
            name="title"
            rules={[{ required: true, message: "Please enter image title" }]}
          >
            <Input placeholder="Enter image title" />
          </Form.Item>

          <Form.Item
            label="Alt Name"
            name="altText"
            rules={[{ required: true, message: "Please enter alt text" }]}
          >
            <Input placeholder="Enter alt text" />
          </Form.Item>

          <Form.Item label="Upload Image">
            <Upload
              fileList={fileList}
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleFileChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
            {isEditMode && !fileList.length && (
              <div className="mt-2 text-gray-500">
                Only upload a new image if you want to replace the existing one.
              </div>
            )}
          </Form.Item>

          {preview && (
            <div className="flex justify-center mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="mt-4">
              {loading ? (isEditMode ? "Updating..." : "Uploading...") : (isEditMode ? "Update Image" : "Upload Image")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ImageUploadForm;
