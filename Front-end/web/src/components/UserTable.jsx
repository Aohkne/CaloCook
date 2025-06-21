import { Space, Table } from "antd";
import { Ban, Check, Edit2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllUsers } from "../api/User";

const columns = [
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
    render: (text) => {
      return (
        <Space>
          {text === true ? (
            <Space>
              <button className="hover:cursor-pointer">
                <Ban size={16} color="red" />
              </button>
            </Space>
          ) : (
            <Space>
              <button className="hover:cursor-pointer">
                <Check size={16} color="green" />
              </button>
            </Space>
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
];

export default function UserTable({
  tabs,
  searchText = "",
  roleFilter = "all",
}) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const user = await getAllUsers();
      if (user) setUsers(user.data);
    };

    fetchData();
  }, []);
  // Filter users by isActive
  let filteredUsers = users;
  if (tabs === "Active") {
    filteredUsers = users.filter((user) => user.isActive);
  } else if (tabs === "Banned") {
    filteredUsers = users.filter((user) => !user.isActive);
  }

  // Filter by role
  if (roleFilter !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
  }

  // Filter by search text (username or email)
  if (searchText.trim() !== "") {
    const lower = searchText.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(lower) ||
        user.email.toLowerCase().includes(lower)
    );
  }

  // Adding a key variable to each user its value is taken from _id
  const dataSource = filteredUsers.map((user) => ({
    ...user,
    key: user._id,
  }));
  return (
    <Table
      className="border border-gray-300 rounded-md overflow-x-auto select-none"
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 5 }}
    />
  );
}
