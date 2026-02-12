import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Breadcrumb } from "antd";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

const StaticMetaForm = () => {
  const [form] = Form.useForm();
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch menu list
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get("/api/menulist/get-menu");
        if (response.data && Array.isArray(response.data.data)) {
          setMenuList(response.data.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching menu list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  // Fetch existing meta data for editing
  useEffect(() => {
    if (id) {
      axios
        .get(`/api/meta/get-meta/${id}`)
        .then((response) => {
          if (response.data && response.data.success) {
            const metaData = response.data.data;
            form.setFieldsValue({
              pageName: metaData.pageName,
              pageSlug: metaData.pageSlug,
              metaTitle: metaData.metaTitle,
              metaDescription: metaData.metaDescription,
              metaKeyword: metaData.metaKeyword,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching meta data:", error);
          toast.error("Failed to fetch meta data");
        });
    }
  }, [id, form]);

  // Function to generate slug from page name
  const generateSlug = (pageName) => {
    return pageName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Handle page selection and auto-fill slug
  const handlePageChange = (value) => {
    const slug = generateSlug(value);
    form.setFieldsValue({ pageSlug: slug });
  };

  // Handle form submission
  const onFinish = async (values) => {
    try {
      if (id) {
        const response = await axios.put(`/api/meta/update-meta/${id}`, values);
        if (response.data.success) {
          toast.success("Meta data updated successfully!");
          navigate("/meta-table");
        }
      } else {
        const response = await axios.post("/api/meta/add-meta", values);
        if (response.data.success) {
          toast.success("Meta data added successfully!");
          form.resetFields();
          navigate("/meta-table");
        }
      }
    } catch (error) {
      // Handle error response from backend
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || "Failed to save meta data";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to save meta data");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">Dashboard</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/meta-table">Meta List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{id ? "Edit Meta" : "Add Meta"}</Breadcrumb.Item>
      </Breadcrumb>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="pageName"
          label="Page Name"
          rules={[{ required: true, message: "Please select a page" }]}
        >
          <Select placeholder="Select a page" loading={loading} onChange={handlePageChange}>
            {/* Static Page Option */}
            <Option key="static-page" value="Static Page">
              Static Page
            </Option>

            {/* Dynamic Menu Options */}
            {menuList.map((menu) => (
              <React.Fragment key={menu._id}>
                {/* Parent Menu */}
                <Option 
                  key={`parent-${menu._id}`} 
                  value={menu.parent.name} 
                  style={{ fontWeight: "bold" }}
                >
                  {menu.parent.name}
                </Option>

                {/* Children */}
                {menu.children.map((child) => (
                  <React.Fragment key={child._id}>
                    <Option 
                      key={`child-${child._id}`} 
                      value={child.name} 
                      style={{ paddingLeft: 20 }}
                    >
                      ├── {child.name}
                    </Option>

                    {/* Sub-Children */}
                    {child.subChildren.map((subChild) => (
                      <Option 
                        key={`subchild-${subChild._id}`} 
                        value={subChild.name} 
                        style={{ paddingLeft: 40 }}
                      >
                        ├──── {subChild.name}
                      </Option>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </Select>
        </Form.Item>

        {/* Page Slug Field */}
        <Form.Item
          name="pageSlug"
          label="Page Slug"
          rules={[{ required: true, message: "Slug is required" }]}
        >
          <Input placeholder="Auto-generated slug" />
        </Form.Item>

        <Form.Item
          name="metaTitle"
          label="Meta Title"
          rules={[{ required: false, message: "Please enter meta title" }]}
        >
          <Input placeholder="Enter Meta Title" />
        </Form.Item>

        <Form.Item
          name="metaDescription"
          label="Meta Description"
          rules={[{ required: false, message: "Please enter meta description" }]}
        >
          <Input.TextArea placeholder="Enter Meta Description" rows={4} />
        </Form.Item>

        <Form.Item
          name="metaKeyword"
          label="Meta Keywords"
          rules={[{ required: false, message: "Please enter meta keywords" }]}
        >
          <Input placeholder="Enter Meta Keywords" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "Update Meta" : "Add Meta"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StaticMetaForm;