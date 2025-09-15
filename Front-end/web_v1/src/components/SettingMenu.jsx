import React from "react";
import { DownOutlined, SettingOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { Cog, DoorClosed, DoorOpen, User } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import { useAuth } from "./AuthContext";
const SettingMenu = () => {
  const navigate = useNavigate();
  const refreshToken = localStorage.getItem("refreshToken");
  const { accessToken } = useAuth();

  const handleLogout = async () => {
    try {
      await logout({ accessToken, refreshToken });
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  const items = [
    {
      key: "1",
      label: <Link to={"/profile"}>Profile</Link>,
      icon: <User />,
    },
    {
      key: "2",
      onClick: handleLogout,
      label: <p>Logout</p>,
      icon: <DoorOpen />,
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      className="hover:bg-white/20 border border-transparent hover:border-white/30 transition-all rounded-md hover:cursor-pointer flex-1 h-10 flex p-2"
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <Cog />
          Settings
        </Space>
      </a>
    </Dropdown>
  );
};

export default SettingMenu;
