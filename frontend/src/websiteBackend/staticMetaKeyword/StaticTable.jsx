import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, Button, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const MetaList = () => {
  const [metaList, setMetaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await axios.get("/api/meta/get-meta");
        if (response.data && Array.isArray(response.data.data)) {
          setMetaList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching meta data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/meta/delete-meta/${id}`);
      message.success("Meta data deleted successfully!");
      setMetaList(metaList.filter((item) => item._id !== id));
    } catch (error) {
      message.error("Failed to delete meta data.");
      console.error("Delete error:", error);
    }
  };

  const columns = [
    {
      title: "Page Name",
      dataIndex: "pageName",
      key: "pageName",
    },
    {
      title: "Meta Title",
      dataIndex: "metaTitle",
      key: "metaTitle",
    },
    {
      title: "Meta Description",
      dataIndex: "metaDescription",
      key: "metaDescription",
    },
    {
      title: "Meta Keywords",
      dataIndex: "metaKeyword",
      key: "metaKeyword",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex space-x-2">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit-meta-form/${record._id}`)}
          />
          <Popconfirm
            title="Are you sure to delete this meta data?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Meta Data</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Static Page Meta</h2>
        <Button type="primary" onClick={() => navigate("/meta-form")}>Add Meta</Button>
      </div>

      <Table
        columns={columns}
        dataSource={metaList}
        rowKey="_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default MetaList;