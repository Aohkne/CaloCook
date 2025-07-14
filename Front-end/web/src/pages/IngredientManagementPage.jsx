import { Filter, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import DishTable from "../components/DishTable";
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Slider,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { getDish } from "../api/dish";
import Tabs from "../components/Tabs";
import { handleApiError } from "../utils/handleApiError";
import SearchBar from "../components/SearchBar";
import IngredientTable from "../components/IngredientTable";
import { addIngredient } from "../api/ingredient";
import { useAuth } from "../components/AuthContext";

export default function IngredientManagementPage() {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Search states
  const [searchText, setSearchText] = useState("");
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  // Add filter state
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingOrder, setPendingOrder] = useState(order);

  // Add Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addIngredient({
        accessToken,
        dishId: values.dishId,
        name: values.name,
        quantity: values.quantity,
        isActive: values.isActive,
      });
      console.log("Add new ingredient");
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // Filter Modal handlers
  const handleFilterOk = () => {
    setSortBy(pendingSortBy);
    setOrder(pendingOrder);
    setIsFilterOpen(false);
  };
  const handleFilterCancel = () => {
    setIsFilterOpen(false);
  };
  const handleSortByChange = (value) => {
    setPendingSortBy(value);
  };
  const handleOrderChange = (e) => {
    setPendingOrder(e.target.value);
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
        Ingredient Management
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
      <IngredientTable
        handleOk={handleOk}
        searchText={searchText}
        sortBy={sortBy}
        order={order}
      />
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input id="name" placeholder="input name of the ingredient" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Quantity is required" }]}
          >
            <Input id="quantity" placeholder="input ingredient quantity" />
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
      {/* Filter Modal */}
      <Modal
        title="Filter Dishes"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isFilterOpen}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Sort By" name="sortBy" initialValue={sortBy}>
            <Select
              placeholder="Sort By"
              value={pendingSortBy}
              onChange={handleSortByChange}
            >
              <Select.Option value="createdAt">Created At</Select.Option>
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="cookingTime">Cooking Time</Select.Option>
              <Select.Option value="calorie">Calorie</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Order" name="order" initialValue={order}>
            <Radio.Group value={pendingOrder} onChange={handleOrderChange}>
              <Radio value="asc">Ascending</Radio>
              <Radio value="desc">Descending</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
