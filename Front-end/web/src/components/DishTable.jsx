import "@ant-design/v5-patch-for-react-19";
import { Link } from "react-router-dom";
import {
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Space,
  Switch,
  Table,
} from "antd";
import { Ban, Check, Edit2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  activateDish,
  deactivateDish,
  editDishById,
  getDish,
} from "../api/dish";
import { useAuth } from "./AuthContext";
import { handleApiError } from "../utils/handleApiError";
import TextArea from "antd/es/input/TextArea";
const DishTable = React.memo(function DishTable({ filters = {} }) {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let params = { ...filters };

      // Convert isActive from string to boolean if present
      if (params.isActive === "true") params.isActive = true;
      else if (params.isActive === "false") params.isActive = false;

      const response = await getDish({ accessToken, ...params });
      if (response) setDishes(response.data);
      else setDishes([]);
    } catch (error) {
      setDishes([]);
      // Optionally log or show error
      console.error("Failed to fetch dishes:", error);
    }
    setLoading(false);
  }, [accessToken, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Edit Modal handlers
  const showModal = useCallback(
    (record) => {
      form.setFieldsValue({
        ...record,
      });
      setIsModalOpen(true);
    },
    [form]
  );
  // Modal handlers
  const handleOkModal = useCallback(async () => {
    try {
      const values = await form.validateFields();
      await editDishById({
        accessToken,
        id: values._id,
        name: values.name,
        cookingTime: values.cookingTime,
        calorie: values.calorie,
        difficulty: values.difficulty,
        description: values.description,
        imageUrl: values.imageUrl,
        isActive: values.isActive,
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      handleApiError(error);
    }
    fetchData();
  }, [accessToken, form, fetchData]);

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handlers for activating and deactivating dishes
  const handleActivate = useCallback(
    async ({ id }) => {
      await activateDish({ accessToken, id });
      fetchData();
    },
    [fetchData, accessToken]
  );
  const handleDeactivate = useCallback(
    async ({ id }) => {
      await deactivateDish({ accessToken, id });
      fetchData();
    },
    [fetchData, accessToken]
  );
  const columns = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (text) => (
          <Space>
            <Image
              src={text}
              width={20}
              height={20}
              className="object-cover rounded"
            />
          </Space>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
          <Space>
            <Link to={`/dish/${record._id}`}>{text}</Link>
          </Space>
        ),
      },
      {
        title: "Cooking Time",
        dataIndex: "cookingTime",
        key: "cookingTime",
        render: (text) => (
          <Space>
            <p>{text}</p>
          </Space>
        ),
      },
      {
        title: "Calories",
        dataIndex: "calorie",
        key: "calorie",
        render: (text) => (
          <Space>
            <p>{text}</p>
          </Space>
        ),
      },
      {
        title: "Difficulty",
        dataIndex: "difficulty",
        key: "difficulty",
        render: (text) => {
          switch (text) {
            case "easy":
              return (
                <Space>
                  <p className="text-green-500">{text}</p>
                </Space>
              );
            case "medium":
              return (
                <Space>
                  <p className="text-yellow-500">{text}</p>
                </Space>
              );
            case "hard":
              return (
                <Space>
                  <p className="text-red-500">{text}</p>
                </Space>
              );
          }
        },
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        render: (text) => {
          return text === true ? (
            <Space>
              <p className="bg-green-50 text-green-600 border border-green-500 px-1 rounded-md">
                Active
              </p>
            </Space>
          ) : (
            <Space>
              <p className=" bg-red-50 text-red-600 border border-red-400 px-1 rounded-md">
                Banned
              </p>
            </Space>
          );
        },
      },
      {
        title: "Action",
        dataIndex: "isActive",
        key: "ban",
        render: (text, record) => {
          return (
            <Space>
              {text === true ? (
                <Popconfirm
                  title="Are you sure you want to deactivate this dish?"
                  okText="Yes"
                  cancelText="Cancel"
                  onConfirm={() => handleDeactivate({ id: record._id })}
                >
                  <button className="hover:cursor-pointer">
                    <Ban size={16} color="red" />
                  </button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Are you sure you want to activate this dish?"
                  okText="Yes"
                  cancelText="Cancel"
                  onConfirm={() => handleActivate({ id: record._id })}
                >
                  <button className="hover:cursor-pointer">
                    <Check size={16} color="green" />
                  </button>
                </Popconfirm>
              )}
              <Space>
                <button className="hover:cursor-pointer">
                  <Edit2
                    size={16}
                    color="gray"
                    onClick={() => showModal(record)}
                  />
                </button>
              </Space>
            </Space>
          );
        },
      },
    ],
    [handleActivate, handleDeactivate, showModal]
  );
  const dataSource = dishes.map((dish) => ({
    ...dish,
    key: dish._id,
  }));

  return (
    <>
      <Table
        size="small"
        className={`border border-gray-300 rounded-md overflow-x-auto`}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 8 }}
        loading={loading}
        scroll={{ x: 600 }}
      />
      <Modal
        title="Edit Dish"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOkModal}
        onCancel={handleCancelModal}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item name="_id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required" },
              {
                min: 3,
                message: "Name must be at least 3 characters",
              },
              {
                max: 50,
                message: "Name cannot exceed 50 characters",
              },
            ]}
          >
            <Input id="name" placeholder="input dish name" />
          </Form.Item>

          <Form.Item
            label="Cooking Time"
            name="cookingTime"
            rules={[
              { required: true, message: "Cooking time is required" },
              { min: 1, message: "Cooking time must be at least 1 minute" },
            ]}
          >
            <Input
              id="cookingTime"
              placeholder="input time to cook this dish"
            />
          </Form.Item>

          <Form.Item
            label="Calories"
            name="calorie"
            rules={[
              { required: true, message: "Calories are required" },
              {
                min: 1,
                message: "Calories must be at least 1",
              },
            ]}
          >
            <Input id="calories" placeholder="input dish calories" />
          </Form.Item>

          <Form.Item label="Difficulty" name="difficulty" initialValue={"easy"}>
            <Radio.Group>
              <Radio.Button value="easy">Easy</Radio.Button>
              <Radio.Button value="medium">Medium</Radio.Button>
              <Radio.Button value="hard">Hard</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Description is required" },
              {
                min: 10,
                message: "Description must be at least 10 characters",
              },
              {
                max: 1000,
                message: "Description cannot exceed 1000 characters",
              },
            ]}
          >
            <TextArea id="description" placeholder="input dish description" />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="imageUrl"
            initialValue={
              "https://cdn-icons-png.freepik.com/512/10551/10551600.png"
            }
          >
            <Input id="imageUrl" placeholder="input image url" />
          </Form.Item>

          <Form.Item
            label="Activate"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch id="activate" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
});

export default DishTable;
