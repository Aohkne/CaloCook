import { Plus } from "lucide-react";
import { useState } from "react";
import DishTable from "../components/DishTable";
import { Button, Form, Input, Modal, Radio, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { addDish } from "../api/dish";
import { handleApiError } from "../utils/handleApiError";
import { useAuth } from "../components/AuthContext";
import DishFilterBar from "../components/DishFilterBar";

export default function DishManagementPage() {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({});
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addDish({
        accessToken,
        name: values.name,
        cookingTime: values.cookingTime,
        calorie: values.calories,
        difficulty: values.difficulty,
        description: values.description,
        imageUrl: values.imageUrl,
        isActive: values.isActive,
      });
      console.log("Add new dish");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold h-10 items-center flex">
        Dish Management
      </h2>
      <p className="text-gray-600">
        Manage dish details, ingredients, and categories.
      </p>

      {/* Searchbar, filter and create */}

      <div className="flex mt-5 mb-5 gap-3">
        <DishFilterBar onChange={setFilters} />
        <Button type="primary" onClick={showModal}>
          Add
        </Button>
      </div>
      <DishTable filters={filters} />
      {/* Add New Item Modal */}
      <Modal
        title="Add New Dish"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} layout="vertical">
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
            name="calories"
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
    </div>
  );
}
