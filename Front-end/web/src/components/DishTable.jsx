import "@ant-design/v5-patch-for-react-19";
import { Image, Popconfirm, Space, Table } from "antd";
import { Ban, Check, Edit2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { activateDish, deactivateDish, getDish } from "../api/dish";
import { useAuth } from "./AuthContext";
const DishTable = React.memo(function DishTable({
  tabs,
  handleOk,
  searchText = "",
  sortBy,
  order,
}) {
  const { accessToken } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let params = {};
      if (tabs === "Active") params.isActive = true;
      else if (tabs === "Banned") params.isActive = false;
      if (searchText) {
        params.name = searchText;
      }
      params.sortBy = sortBy;
      params.order = order;
      const response = await getDish({ accessToken, ...params });
      if (response) setDishes(response.data);
      else setDishes([]);
    } catch (error) {
      setDishes([]);
      // Optionally log or show error
      console.error("Failed to fetch dishes:", error);
    }
    setLoading(false);
  }, [tabs, searchText, sortBy, order, accessToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData, handleOk]);

  const handleActivate = useCallback(
    async ({ id }) => {
      await activateDish({ id });
      fetchData();
    },
    [fetchData]
  );
  const handleDeactivate = useCallback(
    async ({ id }) => {
      await deactivateDish({ id });
      fetchData();
    },
    [fetchData]
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
              width={30}
              height={30}
              className="object-cover rounded"
            />
          </Space>
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => (
          <Space>
            <a>{text}</a>
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
                  <Edit2 size={16} color="gray" />
                </button>
              </Space>
            </Space>
          );
        },
      },
    ],
    [handleActivate, handleDeactivate]
  );
  const dataSource = dishes.map((dish) => ({
    ...dish,
    key: dish._id,
  }));

  return (
    <Table
      size="middle"
      className={`border border-gray-300 rounded-md overflow-x-auto`}
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }}
      loading={loading}
    />
  );
});

export default DishTable;
