import { Popconfirm, Space, Table } from "antd";
import { Ban, Check, Edit2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { activateUser, deactivateUser, getUser } from "../api/user";

export default function UserTable({ tabs, searchText = "" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Move fetchData outside useEffect so it can be called elsewhere
  const fetchData = useCallback(async () => {
    setLoading(true);
    let params = {};
    if (tabs === "Active") params.isActive = true;
    else if (tabs === "Banned") params.isActive = false;
    if (searchText) {
      params.username = searchText;
      params.email = searchText;
    }
    const response = await getUser(params);
    if (response) setUsers(response.data);
    else setUsers([]);
    setLoading(false);
  }, [tabs, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleActivate = useCallback(
    async ({ id }) => {
      await activateUser({ id });
      fetchData();
    },
    [fetchData]
  );

  const handleDeactivate = useCallback(
    async ({ id }) => {
      await deactivateUser({ id });
      fetchData();
    },
    [fetchData]
  );
  const columns = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
        filterSearch: true,
        key: "username",
        sorter: (a, b) => a.username.localeCompare(b.username),
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
        sorter: (a, b) => a.email.localeCompare(b.email),
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
      className="border border-gray-300 rounded-md overflow-x-auto select-none"
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }}
      loading={loading}
    />
  );
}
