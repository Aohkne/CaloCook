import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Tabs,
} from "antd";
import { Ban, Check, Edit2, Plus, Search } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleApiError } from "../utils/handleApiError";
import {
  activateIngredient,
  addIngredient,
  deactivateIngredient,
  editIngredient,
  getIngredientsByDishId,
} from "../api/ingredient";
import {
  activateStep,
  addStep,
  deactivateStep,
  editStep,
  getStepByDishId,
} from "../api/step";

export default function DishTabs({
  ingredients: initialIngredients,
  steps: initialSteps,
  onRefresh,
}) {
  const { accessToken } = useAuth();
  const { id: dishId } = useParams();

  // ======= INGREDIENT SEARCH STATE =======
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientSortBy, setIngredientSortBy] = useState("createdAt");
  const [ingredientOrder, setIngredientOrder] = useState("desc");
  const [ingredients, setIngredients] = useState(initialIngredients || []);

  // ====== STEP SEARCCH STATE =======
  const [stepSearch, setStepSearch] = useState("");
  const [stepSortBy, setStepSortBy] = useState("stepNumber");
  const [stepOrder, setStepOrder] = useState("asc");
  const [steps, setSteps] = useState(initialSteps || []);

  // ======= INGREDIENT MODAL STATE =======
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [editIngredientModalOpen, setEditIngredientModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredientForm] = Form.useForm();
  const [editIngredientForm] = Form.useForm();

  // ======= STEP MODAL STATE =======
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [editStepModalOpen, setEditStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [stepForm] = Form.useForm();
  const [editStepForm] = Form.useForm();

  // ======= INGREDIENT HANDLERS =======
  // Add
  const handleAddIngredient = async () => {
    try {
      const values = await ingredientForm.validateFields();
      await addIngredient({
        accessToken,
        dishId,
        name: values.name,
        quantity: values.quantity,
        isActive: values.isActive,
      });
      message.success("Ingredient added!");
      setIngredientModalOpen(false);
      ingredientForm.resetFields();
      onRefresh && onRefresh(); // Call parent refresh if provided
    } catch (error) {
      handleApiError(error);
    }
  };
  // Cancel
  const handleCancelAddIngredient = () => {
    setIngredientModalOpen(false);
    ingredientForm.resetFields();
  };
  // Edit
  const handleEditIngredient = async () => {
    try {
      const values = await editIngredientForm.validateFields();
      await editIngredient({
        accessToken,
        id: editingIngredient._id,
        dishId,
        name: values.name,
        quantity: values.quantity,
        isActive: values.isActive,
      });
      message.success("Ingredient updated!");
      setEditIngredientModalOpen(false);
      editIngredientForm.resetFields();
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCancelEditIngredient = () => {
    setEditIngredientModalOpen(false);
    setEditingIngredient(null);
    editIngredientForm.resetFields();
  };
  // Ban & Unban
  const handleDeactivateIngredient = async (ingredient) => {
    try {
      const id = ingredient._id;
      await deactivateIngredient({ accessToken, id });
      message.success("Ingredient deactivated!");
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleActivateIngredient = async (ingredient) => {
    try {
      const id = ingredient._id;
      await activateIngredient({ accessToken, id });
      message.success("Ingredient activated!");
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };
  // ======= STEP HANDLERS =======
  // Add
  const handleAddStep = async () => {
    try {
      const values = await stepForm.validateFields();
      await addStep({
        accessToken,
        dishId,
        stepNumber: values.stepNumber,
        description: values.description,
        isActive: true,
      });
      message.success("Step added!");
      setStepModalOpen(false);
      stepForm.resetFields();
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };

  // Cancel
  const handleCancelAddStep = () => {
    setStepModalOpen(false);
    stepForm.resetFields();
  };

  const handleEditStep = async () => {
    try {
      const values = await editStepForm.validateFields();
      await editStep({
        accessToken,
        id: editingStep._id,
        dishId,
        stepNumber: values.stepNumber,
        description: values.description,
        isActive: values.isActive,
      });
      message.success("Ingredient updated!");
      setEditStepModalOpen(false);
      editStepForm.resetFields();
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleCancelEditStep = () => {
    setEditStepModalOpen(false);
    setEditingStep(null);
    editStepForm.resetFields();
  };
  // Ban & Unban
  const handleDeactivateStep = async (step) => {
    try {
      const id = step._id;
      await deactivateStep({ accessToken, id });
      message.success("Step deactivated!");
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };
  const handleActivateStep = async (step) => {
    try {
      const id = step._id;
      await activateStep({ accessToken, id });
      message.success("Step activated!");
      onRefresh && onRefresh();
    } catch (error) {
      handleApiError(error);
    }
  };

  // ======= Fetch Ingredients =======
  useEffect(() => {
    async function fetchIngredients() {
      try {
        const res = await getIngredientsByDishId({
          accessToken,
          dishId,
          sortBy: ingredientSortBy,
          order: ingredientOrder,
        });
        let filtered = res.data;
        if (ingredientSearch) {
          filtered = filtered.filter((i) =>
            i.name.toLowerCase().includes(ingredientSearch.toLowerCase())
          );
        }
        setIngredients(filtered);
      } catch (err) {
        handleApiError(err);
      }
    }
    fetchIngredients();
  }, [
    accessToken,
    dishId,
    ingredientSearch,
    ingredientSortBy,
    ingredientOrder,
    onRefresh,
  ]);

  // ======= Fetch Steps =======
  useEffect(() => {
    async function fetchSteps() {
      try {
        const res = await getStepByDishId({
          accessToken,
          dishId,
          sortBy: stepSortBy,
          order: stepOrder,
        });
        let filtered = res.data;
        if (stepSearch) {
          filtered = filtered.filter((s) =>
            s.description.toLowerCase().includes(stepSearch.toLowerCase())
          );
        }
        setSteps(filtered);
      } catch (err) {
        handleApiError(err);
      }
    }
    fetchSteps();
  }, [accessToken, dishId, stepSearch, stepSortBy, stepOrder, onRefresh]);
  const items = [
    {
      key: "1",
      label: "Ingredients",
      children: (
        <>
          {/* Search and Add Row */}
          <div className="flex gap-4 items-center mb-4">
            <Input
              placeholder="Search ingredients..."
              prefix={<Search size={16} />}
              style={{ width: 300 }}
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              allowClear
            />
            <Select
              value={ingredientSortBy}
              onChange={setIngredientSortBy}
              style={{ width: 130 }}
              options={[
                { value: "name", label: "Name" },
                { value: "quantity", label: "Quantity" },
                { value: "createdAt", label: "Created At" },
              ]}
            />
            <Select
              value={ingredientOrder}
              onChange={setIngredientOrder}
              style={{ width: 90 }}
              options={[
                { value: "asc", label: "Asc" },
                { value: "desc", label: "Desc" },
              ]}
            />
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="flex items-center gap-1"
              onClick={() => setIngredientModalOpen(true)}
            >
              Add
            </Button>
          </div>
          {ingredients.length === 0 ? (
            <p className="text-center text-sm text-black/40 mt-4">
              No ingredients yet. Click <strong>Add</strong> to create one.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex gap-3 items-center border border-black/10 rounded-md px-4 py-3 bg-white"
                >
                  {/* Left: Name & Quantity */}
                  <div>
                    <p className="font-semibold text-base">{ingredient.name}</p>
                    <p className="text-sm text-black/50">
                      {ingredient.quantity}
                    </p>
                  </div>

                  {/* Center: Status */}
                  <div className="ml-auto">
                    {ingredient.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-300 text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-300 text-xs">
                        Banned
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2">
                    {ingredient.isActive ? (
                      <Popconfirm
                        title="Are you sure you want to deactivate this ingredient?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => handleDeactivateIngredient(ingredient)}
                      >
                        <button className="hover:cursor-pointer">
                          <Ban size={16} color="red" />
                        </button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title="Are you sure you want to activate this ingredient?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => handleActivateIngredient(ingredient)}
                      >
                        <button className="hover:cursor-pointer">
                          <Check size={16} color="green" />
                        </button>
                      </Popconfirm>
                    )}
                    <button
                      className="hover:bg-gray-100 hover:cursor-pointer p-1 rounded"
                      title="Edit Ingredient"
                      onClick={() => {
                        setEditingIngredient(ingredient);
                        editIngredientForm.setFieldsValue({
                          name: ingredient.name,
                          quantity: ingredient.quantity,
                          isActive: ingredient.isActive,
                        });
                        setEditIngredientModalOpen(true);
                      }}
                    >
                      <Edit2 size={16} color="gray" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Add Ingredient Modal */}
          <Modal
            title="Add Ingredient"
            open={ingredientModalOpen}
            onOk={handleAddIngredient}
            onCancel={handleCancelAddIngredient}
            destroyOnHidden
          >
            <Form form={ingredientForm} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Quantity is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="isActive"
                name="isActive"
                initialValue={true}
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
          {/* Edit Ingredient Modal */}
          <Modal
            title="Edit Ingredient"
            open={editIngredientModalOpen}
            onOk={handleEditIngredient}
            onCancel={handleCancelEditIngredient}
            destroyOnHidden
          >
            <Form form={editIngredientForm} layout="vertical">
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Quantity is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="isActive"
                name="isActive"
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        </>
      ),
    },
    {
      key: "2",
      label: "Steps",
      children: (
        <>
          {/* Search and Add Row */}
          <div className="flex gap-4 items-center mb-4">
            <Input
              placeholder="Search steps..."
              prefix={<Search size={16} />}
              value={stepSearch}
              onChange={(e) => setStepSearch(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={stepSortBy}
              onChange={setStepSortBy}
              style={{ width: 130 }}
              options={[
                { value: "stepNumber", label: "Step Number" },
                { value: "description", label: "Description" },
                { value: "createdAt", label: "Created At" },
              ]}
            />
            <Select
              value={stepOrder}
              onChange={setStepOrder}
              style={{ width: 90 }}
              options={[
                { value: "asc", label: "Asc" },
                { value: "desc", label: "Desc" },
              ]}
            />
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="flex items-center gap-1"
              onClick={() => setStepModalOpen(true)}
            >
              Add
            </Button>
          </div>
          {steps.length === 0 ? (
            <p className="text-center text-sm text-black/40 mt-4">
              No steps yet. Click <strong>Add</strong> to create one.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className="flex gap-2 border border-black/10 px-4 py-3 rounded-md"
                >
                  <p className="border-r pr-3 border-black/10 text-black/50 font-semibold">
                    {step.stepNumber}
                  </p>
                  <p>{step.description}</p>
                  {/* Center: Status */}
                  <div className="ml-auto">
                    {step.isActive ? (
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-300 text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-300 text-xs">
                        Banned
                      </span>
                    )}
                  </div>
                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 ">
                    {step.isActive ? (
                      <Popconfirm
                        title="Are you sure you want to deactivate this step?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => handleDeactivateStep(step)}
                      >
                        <button className="hover:cursor-pointer">
                          <Ban size={16} color="red" />
                        </button>
                      </Popconfirm>
                    ) : (
                      <Popconfirm
                        title="Are you sure you want to activate this step?"
                        okText="Yes"
                        cancelText="Cancel"
                        onConfirm={() => handleActivateStep(step)}
                      >
                        <button className="hover:cursor-pointer">
                          <Check size={16} color="green" />
                        </button>
                      </Popconfirm>
                    )}
                    <button
                      className="hover:bg-gray-100 hover:cursor-pointer p-1 rounded"
                      title="Edit Ingredient"
                      onClick={() => {
                        setEditingStep(step);
                        editStepForm.setFieldsValue({
                          stepNumber: step.stepNumber,
                          description: step.description,
                          isActive: step.isActive,
                        });
                        setEditStepModalOpen(true);
                      }}
                    >
                      <Edit2 size={16} color="gray" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Add Step Modal */}
          <Modal
            title="Add Step"
            open={stepModalOpen}
            onOk={handleAddStep}
            onCancel={handleCancelAddStep}
            destroyOnHidden
          >
            <Form form={stepForm} layout="vertical">
              <Form.Item
                label="Step Number"
                name="stepNumber"
                rules={[{ required: true, message: "Step number is required" }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Modal>
          {/* Edit Step Modal */}
          <Modal
            title="Edit Step"
            open={editStepModalOpen}
            onOk={handleEditStep}
            onCancel={handleCancelEditStep}
            destroyOnHidden
          >
            <Form form={editStepForm} layout="vertical">
              <Form.Item
                label="Step Number"
                name="stepNumber"
                rules={[{ required: true, message: "Step number is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="isActive"
                name="isActive"
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        </>
      ),
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} />;
}
