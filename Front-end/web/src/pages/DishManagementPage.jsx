import { Plus } from "lucide-react";
import { useState } from "react";
import DishTable from "../components/DishTable";
import { Form, Input, Modal, Radio, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { addDish } from "../api/dish";
import { handleApiError } from "../utils/handleApiError";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../components/AuthContext";
import FilterModal from "../components/FilterModal";

const dishFields = [
  { name: "name", label: "Name", type: "text" },
  {
    type: "group",
    label: "Cooking Time",
    children: [
      { name: "minCookingTime", label: "Min", type: "number" },
      { name: "maxCookingTime", label: "Max", type: "number" },
    ],
  },
  {
    type: "group",
    label: "Calories",
    children: [
      { name: "minCalorie", label: "Min", type: "number" },
      { name: "maxCalorie", label: "Max", type: "number" },
    ],
  },
  {
    name: "difficulty",
    label: "Difficulty",
    type: "select",
    mode: "multiple",
    options: ["easy", "medium", "hard"],
  },
  {
    name: "isActive",
    label: "Active",
    type: "select",
    options: ["true", "false"],
  },
  {
    name: "sortBy",
    label: "Sort By",
    type: "select",
    options: ["name", "cookingTime", "calorie", "createdAt"],
  },
  { name: "order", label: "Order", type: "select", options: ["asc", "desc"] },
];

export default function DishManagementPage() {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  // Combine filters and search for UserTable
  const combinedFilters = { ...filters };
  if (search) {
    combinedFilters.name = search;
    // Or use 'email' if you want to search by email
    // combinedFilters.email = search;
  }
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
      <div className="flex mt-5 mb-5 items-center gap-2">
        <SearchBar
          placeholder="Search username..."
          onSearch={({ search }) => setSearch(search)}
        />
        <FilterModal fields={dishFields} onFilter={setFilters} />
        <button
          className="flex border border-gray-500 rounded-md items-center gap-1 py-1 px-2 font-medium text-sm hover:bg-gray-100 hover:cursor-pointer select-none"
          onClick={showModal}
        >
          Create <Plus size={16} />
        </button>
      </div>
      <DishTable filters={combinedFilters} />
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
