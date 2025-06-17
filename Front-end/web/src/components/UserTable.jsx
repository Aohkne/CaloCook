import { Space, Table } from "antd";
import { Ban, Check, Edit, Edit2 } from "lucide-react";
const users = [
  {
    _id: {
      $oid: "68306f4d4928f3fe108df627",
    },
    email: "nguyenvana@example.com",
    password_hash: "$2b$10$abcdefghij1234567890mnopqrstuv",
    role: "admin",
    username: "nguyenvana",
    calorieLimit: 2200,
    avatar_url: "",
    gender: "male",
    dob: "1990-05-01",
    height: 170,
    weight: 65,
    isActive: true,
    createdAt: {
      $date: "2025-05-23T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-23T07:00:00.000Z",
    },
  },
  {
    _id: {
      $oid: "68306f4d4928f3fe108df628",
    },
    email: "tranthib@example.com",
    password_hash: "$2b$10$klmnopqrstuv1234567890abcdefghij",
    role: "user",
    username: "tranthib",
    calorieLimit: 1800,
    avatar_url: "",
    gender: "female",
    dob: "1995-07-20",
    height: 160,
    weight: 50,
    isActive: true,
    createdAt: {
      $date: "2025-05-24T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-24T07:00:00.000Z",
    },
  },
  {
    _id: {
      $oid: "68306f4d4928f3fe108df629",
    },
    email: "lecuong@example.com",
    password_hash: "$2b$10$1234567890abcdefghijklmnpqrstuv",
    role: "user",
    username: "lecuong",
    calorieLimit: 2000,
    avatar_url: "",
    gender: "male",
    dob: "1992-09-15",
    height: 175,
    weight: 70,
    isActive: false,
    createdAt: {
      $date: "2025-05-25T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-25T07:00:00.000Z",
    },
  },
  {
    _id: {
      $oid: "68306f4d4928f3fe108df62a",
    },
    email: "phamthi@example.com",
    password_hash: "$2b$10$mnopqrstuvabcdefghij1234567890",
    role: "user",
    username: "phamthi",
    calorieLimit: 2100,
    avatar_url: "",
    gender: "female",
    dob: "1988-12-10",
    height: 158,
    weight: 55,
    isActive: true,
    createdAt: {
      $date: "2025-05-26T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-26T07:00:00.000Z",
    },
  },
  {
    _id: {
      $oid: "68306f4d4928f3fe108df62b",
    },
    email: "doanh@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuv1234567890",
    role: "user",
    username: "doanhuuanh",
    calorieLimit: 1900,
    avatar_url: "",
    gender: "male",
    dob: "1993-03-30",
    height: 172,
    weight: 68,
    isActive: false,
    createdAt: {
      $date: "2025-05-27T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-27T07:00:00.000Z",
    },
  },
  {
    _id: {
      $oid: "68306f4d4928f3fe108d",
    },
    email: "doanh@example.com",
    password_hash: "$2b$10$abcdefghijklmnopqrstuv1234567890",
    role: "user",
    username: "doanhuuanh",
    calorieLimit: 1900,
    avatar_url: "",
    gender: "male",
    dob: "1993-03-30",
    height: 172,
    weight: 68,
    isActive: false,
    createdAt: {
      $date: "2025-05-27T07:00:00.000Z",
    },
    updatedAt: {
      $date: "2025-05-27T07:00:00.000Z",
    },
  },
];
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
    key: user._id.$oid,
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
