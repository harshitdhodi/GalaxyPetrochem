import React, { useEffect } from "react";
import { Form, Input, Button, Space, Card } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useCreateMenuListingMutation, useUpdateMenuListingMutation, useGetMenuListingByIdQuery, useGetAllMenuListingsQuery } from "@/slice/menuListing/menuList";
import { useNavigate, useParams } from "react-router-dom";

const MenuListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form] = Form.useForm();
  
  const { data, isLoading } = useGetMenuListingByIdQuery(id, { skip: !id });
  const { refetch: refetchAllMenuListings } = useGetAllMenuListingsQuery();
  const [createMenuListing] = useCreateMenuListingMutation();
  const [updateMenuListing] = useUpdateMenuListingMutation();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data.data);
    }
  }, [data, form]);

  const handleSubmit = async (values) => {
    if (id) {
      await updateMenuListing({ id, ...values });
    } else {
      await createMenuListing(values);
    }
    await refetchAllMenuListings();
    navigate("/menu-listing-table");
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card title={id ? "Update Menu Listing" : "Create Menu Listing"} bordered={false}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ children: [] }}>
        
        {/* Parent Menu */}
        <Card title="Parent Menu" bordered={true} style={{ marginBottom: "20px" }}>
          <Form.Item name={["parent", "name"]} label="Name" rules={[{ required: true, message: "Please enter parent menu name" }]}>
            <Input placeholder="Enter parent menu name" />
          </Form.Item>
          <Form.Item name={["parent", "path"]} label="Path" rules={[{ required: true, message: "Please enter parent menu path" }]}>
            <Input placeholder="Enter parent menu path" />
          </Form.Item>
        </Card>

        {/* Children Menus */}
        <Form.List name="children">
          {(fields, { add, remove }) => (
            <Card title="Children Menus" bordered={true}>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} bordered={true} style={{ marginBottom: "15px" }}>
                  <Space align="baseline">
                    <Form.Item {...restField} name={[name, "name"]} label="Child Name" rules={[{ required: true, message: "Enter child name" }]}>
                      <Input placeholder="Enter child name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "path"]} label="Child Path" rules={[{ required: true, message: "Enter child path" }]}>
                      <Input placeholder="Enter child path" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>

                  {/* SubChildren */}
                  <Form.List name={[name, "subChildren"]}>
                    {(subFields, { add: addSub, remove: removeSub }) => (
                      <Card title="Sub-Children" bordered={true}>
                        {subFields.map(({ key: subKey, name: subName, ...subRestField }) => (
                          <Space key={subKey} align="baseline">
                            <Form.Item {...subRestField} name={[subName, "name"]} label="Sub-Child Name" rules={[{ required: true, message: "Enter sub-child name" }]}>
                              <Input placeholder="Enter sub-child name" />
                            </Form.Item>
                            <Form.Item {...subRestField} name={[subName, "path"]} label="Sub-Child Path" rules={[{ required: true, message: "Enter sub-child path" }]}>
                              <Input placeholder="Enter sub-child path" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => removeSub(subName)} />
                          </Space>
                        ))}
                        <Button type="dashed" onClick={() => addSub()} block icon={<PlusOutlined />}>
                          Add Sub-Child
                        </Button>
                      </Card>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Child
              </Button>
            </Card>
          )}
        </Form.List>

        <Button type="primary" htmlType="submit" style={{ marginTop: "20px" }}>
          {id ? "Update" : "Create"}
        </Button>
      </Form>
    </Card>
  );
};

export default MenuListingForm;