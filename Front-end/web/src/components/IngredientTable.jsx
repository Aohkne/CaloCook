import "@ant-design/v5-patch-for-react-19";
import { Image, Popconfirm, Space, Table } from "antd";
import { Ban, Check, Edit2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getIngredients,
  activateIngredient,
  deactivateIngredient,
} from "../api/ingredient";
import { useAuth } from "./AuthContext";
import { getDish } from "../api/dish"; // Import your getDish API
import { handleApiError } from "../utils/handleApiError";
const IngredientTable = React.memo(function IngredientTable({
  tabs,
  handleOk,
  searchText = "",
  sortBy = "createdAt",
  order = "desc",
}) {
  const { accessToken } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dishMap, setDishMap] = useState({});

  // Fetch all dishes and build a map: dishId -> dishName
  useEffect(() => {
    async function fetchDishes() {
      try {
        const response = await getDish({ accessToken });
        const map = {};
        response.data.forEach((dish) => {
          map[dish._id] = dish.name;
        });
        setDishMap(map);
      } catch (error) {
        handleApiError(error);
      }
    }
    fetchDishes();
  }, [accessToken]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let params = {};
      if (tabs === "Active") params.isActive = true;
      else if (tabs === "Banned") params.isActive = false;
      if (searchText) {
        params.name = searchText;
      }
      if (sortBy) params.sortBy = sortBy;
      if (order) params.order = order;
      const response = await getIngredients({ accessToken, ...params });
      if (response) setIngredients(response.data);
      else setIngredients([]);
    } catch (error) {
      setIngredients([]);
      // Optionally log or show error
      console.error("Failed to fetch ingredients:", error);
    }
    setLoading(false);
  }, [tabs, searchText, sortBy, order, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData, handleOk]);

  const handleActivate = useCallback(
    async ({ id }) => {
      await activateIngredient({ accessToken, id });
      fetchData();
    },
    [fetchData, accessToken]
  );
  const handleDeactivate = useCallback(
    async ({ id }) => {
      await deactivateIngredient({ accessToken, id });
      fetchData();
    },
    [fetchData, accessToken]
  );
  const columns = useMemo(
    () => [
      {
        title: "Ingredient Name",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <Space>
            <p>{text}</p>
          </Space>
        ),
      },
      {
        title: "Dish Name",
        dataIndex: "dishId",
        key: "dishId",
        render: (dishId) => (
          <Space>
            <p>{dishMap[dishId] || "Unknown"}</p>
          </Space>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        render: (text) => (
          <Space>
            <p>{text}</p>
          </Space>
        ),
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
                  title="Are you sure you want to deactivate this ingredient?"
                  okText="Yes"
                  cancelText="Cancel"
                  onConfirm={() =>
                    handleDeactivate({ accessToken, id: record._id })
                  }
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
                  onConfirm={() =>
                    handleActivate({ accessToken, id: record._id })
                  }
                >
                  <button className="hover:cursor-pointer">
                    <Check size={16} color="green" />
                  </button>
                </Popconfirm>
              )}
              <Space>
                <button className="hover:cursor-pointer">
                  <Edit2 size={16} color="gray" />
                </button>
              </Space>
            </Space>
          );
        },
      },
    ],
    [dishMap, handleActivate, handleDeactivate, accessToken]
  );
  const dataSource = ingredients.map((ingredient) => ({
    ...ingredient,
    key: ingredient._id,
  }));

  return (
    <Table
      size="large"
      className={`border border-gray-300 rounded-md overflow-x-auto`}
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }}
      loading={loading}
    />
  );
});

export default IngredientTable;
