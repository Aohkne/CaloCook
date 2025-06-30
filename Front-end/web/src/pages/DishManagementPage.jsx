import { Plus } from "lucide-react";
import DishTable from "../components/DishTable";
import { useState } from "react";
import { Form, Input, Modal, Radio, Select, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import { addDish } from "../api/dish";
import Tabs from "../components/Tabs";
import { handleApiError } from "../utils/handleApiError";
import SearchBar from "../components/SearchBar";

export default function DishManagementPage() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [cookingTime, setCookingTime] = useState();
  const [calorie, setCalorie] = useState();
  const [difficulty, setDifficulty] = useState("easy");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  // Tabs states
  const [selectedTab, setSelectedTab] = useState("All Dishes");
  const tabs = ["All Dishes", "Active", "Banned"];
  // Search states
  const [searchText, setSearchText] = useState("");
  // Filter states
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  // Modal handlers
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      await addDish({
        name,
        cookingTime,
        calorie,
        difficulty,
        description,
        imageUrl,
        isActive,
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
  // Dish handlers
  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleChangeCookingTime = (e) => {
    setCookingTime(e.target.value);
  };

  const handleChangeCalorie = (e) => {
    setCalorie(e.target.value);
  };

  const handleChangeDifficulty = (e) => {
    setDifficulty(e.target.value);
  };

  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleChangeImageUrl = (e) => {
    setImageUrl(e.target.value);
  };
  const handleActivateDish = (checked) => {
    setIsActive(checked);
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
      {/* Add New Item */}
      <Modal
        title="Add New Dish"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input
              onChange={handleChangeName}
              id="name"
              placeholder="input dish name"
            />
          </Form.Item>

          <Form.Item
            label="Cooking Time"
            name="cookingTime"
            rules={[{ required: true, message: "Cooking time is required" }]}
          >
            <Input
              onChange={handleChangeCookingTime}
              id="cookingTime"
              placeholder="input time to cook this dish"
            />
          </Form.Item>

          <Form.Item
            label="Calories"
            name="calories"
            rules={[{ required: true, message: "Calories are required" }]}
          >
            <Input
              onChange={handleChangeCalorie}
              id="calories"
              placeholder="input dish calories"
            />
          </Form.Item>

          <Form.Item label="Difficulty" name="difficulty">
            <Radio.Group value={difficulty} onChange={handleChangeDifficulty}>
              <Radio.Button value="easy">Easy</Radio.Button>
              <Radio.Button value="medium">Medium</Radio.Button>
              <Radio.Button value="hard">Hard</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea
              onChange={handleChangeDescription}
              id="description"
              placeholder="input dish description"
            />
          </Form.Item>

          <Form.Item label="Image URL" name="imageUrl">
            <Input
              onChange={handleChangeImageUrl}
              id="imageUrl"
              placeholder="input image url"
            />
          </Form.Item>

          <Form.Item label="Activate" name="activate" valuePropName="checked">
            <Switch
              id="activate"
              checked={isActive}
              onChange={handleActivateDish}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
