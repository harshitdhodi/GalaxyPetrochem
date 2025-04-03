import React, { useEffect, useState } from "react";
import { Table, Image, message, Card, Button, Popconfirm, Breadcrumb } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SlideShowTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/slideShow/getAll");

      // Ensure response contains an array
      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Handle case where API wraps data inside an object
        setData(response.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      message.error("Failed to fetch slideshow data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Image Function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/slideShow/delete?id=${id}`);
      message.success("Image deleted successfully!");
      fetchData(); // Refresh table after deletion
    } catch (error) {
      message.error("Failed to delete image.");
      console.error(error);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <Image
            src={`/api/logo/download/${image}`}
            alt="Slide"
            width={80}
            height={50}
            className="rounded-lg shadow object-contain"
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Alt Name",
      dataIndex: "altText",
      key: "altText",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-3">
          {/* Edit Button */}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-image/${record._id}`)}
          />

          {/* Delete Button with Confirmation */}
          <Popconfirm
            title="Are you sure you want to delete this image?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen px-6">
      {/* Breadcrumb Navigation */}
      <div className="w-full  mb-4 flex justify-between items-center">
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/dashboard")}>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Slideshow</Breadcrumb.Item>
        </Breadcrumb>

        {/* Add Image Button */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/slideShow-form")}
        >
          Add Image
        </Button>
      </div>

      {/* Card Container */}
      <Card className="w-full max-w-7xl shadow-lg rounded-xl ">
        <h2 className="text-xl font-semibold text-left mb-4">
          Slideshow Images
        </h2>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default SlideShowTable;
