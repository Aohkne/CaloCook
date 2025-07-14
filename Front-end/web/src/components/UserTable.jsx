import { Popconfirm, Space, Table } from "antd";
import { Ban, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { activateUser, deactivateUser, getUser } from "../api/user";
import { useAuth } from "./AuthContext";
import { handleApiError } from "../utils/handleApiError";
export default function UserTable({ filters = {} }) {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Move fetchData outside useEffect so it can be called elsewhere
  const fetchData = useCallback(async () => {
    setLoading(true);
    let params = { ...filters };

    // Convert isActive from string to boolean if present
    if (params.isActive === "true") params.isActive = true;
    else if (params.isActive === "false") params.isActive = false;

    const response = await getUser({ accessToken, ...params });
    if (response) setUsers(response.data);
    else setUsers([]);
    setLoading(false);
  }, [accessToken, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActivate = useCallback(
    async ({ id }) => {
      try {
        await activateUser({ accessToken, id });
        fetchData();
      } catch (error) {
        handleApiError(error);
      }
    },
    [fetchData, accessToken]
  );

  const handleDeactivate = useCallback(
    async ({ id }) => {
      try {
        await deactivateUser({ accessToken, id });
        fetchData();
      } catch (error) {
        handleApiError(error);
      }
    },
    [fetchData, accessToken]
  );
  const columns = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
        filterSearch: true,
        key: "username",
        render: (text) => (
          <Space>
            <a>{text}</a>
          </Space>
        ),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text) => (
          <Space>
            <p>{text}</p>
          </Space>
        ),
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "email",
        render: (text) => {
          return text === "admin" ? (
            <Space>
              <p className=" bg-amber-50 text-amber-600 border border-amber-400 px-1 rounded-md">
                {text}
              </p>
            </Space>
          ) : (
            <Space>
              <p className="bg-gray-50 text-gray-600 border border-gray-400 px-1 rounded-md">
                {text}
              </p>
            </Space>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "status",
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
                  title="Are you sure you want to deactivate this user?"
                  onConfirm={() => handleDeactivate({ id: record._id })}
                  okText="Yes"
                  cancelText="Cancel"
                >
                  <button className="hover:cursor-pointer">
                    <Ban size={16} color="red" />
                  </button>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="Are you sure you want to activate this user?"
                  onConfirm={() => handleActivate({ id: record._id })}
                  okText="Yes"
                  cancelText="Cancel"
                >
                  <button className="hover:cursor-pointer">
                    <Check size={16} color="green" />
                  </button>
                </Popconfirm>
              )}
            </Space>
          );
        },
      },
    ],
    [handleActivate, handleDeactivate]
  );
  const dataSource = users.map((user) => ({
    ...user,
    key: user._id,
  }));

  return (
    <Table
      size="small"
      className="border border-gray-300 rounded-md overflow-x-auto select-none"
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 9 }}
      loading={loading}
      scroll={{ x: 600 }}
    />
  );
}
