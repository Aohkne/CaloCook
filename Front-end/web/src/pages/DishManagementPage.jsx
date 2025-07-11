import { Filter, Plus } from "lucide-react";
import { useState } from "react";
import DishTable from "../components/DishTable";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Slider,
  Space,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { addDish } from "../api/dish";
import Tabs from "../components/Tabs";
import { handleApiError } from "../utils/handleApiError";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../components/AuthContext";

export default function DishManagementPage() {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Tabs states
  const [selectedTab, setSelectedTab] = useState("All Dishes");
  const tabs = ["All Dishes", "Active", "Banned"];
  // Search states
  const [searchText, setSearchText] = useState("");
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [minCookingTime, setMinCookingTime] = useState(1);
  const [maxCookingTime, setMaxCookingTime] = useState(10080);
  const [minCalorie, setMinCalorie] = useState(1);
  const [maxCalorie, setMaxCalorie] = useState(10000);
  const [difficulty, setDifficulty] = useState(["easy", "medium", "hard"]);
  // Add filter state
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingOrder, setPendingOrder] = useState(order);
  const [pendingMinCookingTime, setPendingMinCookingTime] =
    useState(minCookingTime);
  const [pendingMaxCookingTime, setPendingMaxCookingTime] =
    useState(maxCookingTime);
  const [pendingMinCalorie, setPendingMinCalorie] = useState(minCalorie);
  const [pendingMaxCalorie, setPendingMaxCalorie] = useState(maxCalorie);
  const [pendingDifficulty, setPendingDifficulty] = useState(difficulty);

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
  // Filter Modal handlers
  const handleFilterOk = () => {
    setSortBy(pendingSortBy);
    setOrder(pendingOrder);
    setMinCookingTime(pendingMinCookingTime);
    setMaxCookingTime(pendingMaxCookingTime);
    setMinCalorie(pendingMinCalorie);
    setMaxCalorie(pendingMaxCalorie);
    setDifficulty(pendingDifficulty);
    setIsFilterOpen(false);
  };
  const handleFilterCancel = () => {
    setIsFilterOpen(false);
  };
  const showFilterModal = () => {
    setPendingSortBy(sortBy);
    setPendingOrder(order);
    setIsFilterOpen(true);
  };
  const handleSortByChange = (value) => {
    setPendingSortBy(value);
  };
  const handleOrderChange = (e) => {
    setPendingOrder(e.target.value);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold h-10 items-center flex">
        Dish Management
      </h2>
      <p className="text-gray-600">
        Manage dish details, ingredients, and categories.
      </p>
      {/* Tabs */}
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
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
          onClick={showFilterModal}
        >
          Filter <Filter size={16} />
        </button>
        <button
          className="flex border border-gray-500 rounded-md items-center gap-1 py-1 px-2 font-medium text-sm hover:bg-gray-100 hover:cursor-pointer select-none"
          onClick={showModal}
        >
          Create <Plus size={16} />
        </button>
      </div>
      <DishTable
        tabs={selectedTab}
        handleOk={handleOk}
        searchText={searchText}
        sortBy={sortBy}
        order={order}
      />
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
      {/* Filter Modal */}
      <Modal
        title="Filter Dishes"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isFilterOpen}
        onOk={handleFilterOk}
        onCancel={handleFilterCancel}
        centered
      >
        <Form form={form} layout="vertical">
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
          <Form.Item label="Cooking Time (minutes)">
            <Space>
              <Form.Item name="minCookingTime" noStyle>
                <InputNumber
                  min={1}
                  max={10080}
                  placeholder="Min"
                  value={pendingMinCookingTime}
                  onChange={setPendingMinCookingTime}
                />
              </Form.Item>
              <span>-</span>
              <Form.Item name="maxCookingTime" noStyle>
                <InputNumber
                  min={1}
                  max={10080}
                  placeholder="Max"
                  value={pendingMaxCookingTime}
                  onChange={setPendingMaxCookingTime}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="Calories">
            <Space>
              <Form.Item name="minCalorie" noStyle>
                <InputNumber
                  min={1}
                  max={10000}
                  placeholder="Min"
                  value={pendingMinCalorie}
                  onChange={setPendingMinCalorie}
                />
              </Form.Item>
              <span>-</span>
              <Form.Item name="maxCalorie" noStyle>
                <InputNumber
                  min={1}
                  max={10000}
                  placeholder="Max"
                  value={pendingMaxCalorie}
                  onChange={setPendingMaxCalorie}
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label="Difficulty" name="difficulty">
            <Checkbox.Group
              value={pendingDifficulty}
              onChange={setPendingDifficulty}
            >
              <Checkbox value="easy">Easy</Checkbox>
              <Checkbox value="medium">Medium</Checkbox>
              <Checkbox value="hard">Hard</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
