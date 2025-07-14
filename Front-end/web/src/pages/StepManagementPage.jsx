import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Form, Input, Modal, Select, Switch } from "antd";
import { getDish } from "../api/dish";
import { handleApiError } from "../utils/handleApiError";
import SearchBar from "../components/SearchBar";
import StepTable from "../components/StepTable";
import { useAuth } from "../components/AuthContext";
import { addStep } from "../api/step";

export default function StepManagementPage() {
  const [form] = Form.useForm();
  const { accessToken } = useAuth();
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Search states
  const [searchText, setSearchText] = useState("");
  // Add Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addStep({
        accessToken,
        dishId: values.dishId,
        stepNumber: values.stepNumber,
        description: values.description,
        isActive: values.isActive,
      });
      console.log("Add new dish");
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Fetch dishes for the select dropdown
  const [dishes, setDishes] = useState([]);
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await getDish({ accessToken });
        setDishes(response.data);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchDishes();
  }, [accessToken]);

  return (
    <div>
      <h2 className="text-xl md:text-3xl font-bold h-10 items-center flex">
        Step Management
      </h2>
      <p className="text-gray-600">
        Manage dish details, ingredients, and categories.
      </p>
      {/* Searchbar, filter and create */}
      <div className="flex mt-5 mb-5 items-center gap-2">
        <SearchBar
          placeholder={"Search dish..."}
          searchText={searchText}
          setSearchText={setSearchText}
          classname="flex-1"
        />
        <button
          className="flex border border-gray-500 rounded-md items-center gap-1 py-1 px-2 font-medium text-sm hover:bg-gray-100 hover:cursor-pointer select-none"
          onClick={showModal}
        >
          Create <Plus size={16} />
        </button>
      </div>
      <StepTable handleOk={handleOk} />
      {/* Add New Item Modal */}
      <Modal
        title="Add New Ingredient"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Dish"
            name="dishId"
            rules={[{ required: true, message: "Dish is required" }]}
          >
            <Select
              showSearch
              placeholder="Select a dish"
              optionFilterProp="label"
              style={{ width: 200 }}
            >
              {dishes.map((dish) => (
                <Select.Option key={dish._id} value={dish._id}>
                  {dish.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Step Number"
            name="stepNumber"
            rules={[{ required: true, message: "Step Number is required" }]}
          >
            <Input id="stepNumber" placeholder="input step number" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input id="description" placeholder="input step description" />
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
