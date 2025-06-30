import { Avatar, Divider } from "antd";
import { Edit, Mail, Shield, Target, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserById } from "../api/user";
import { useAuth } from "../components/AuthContext";

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const [activateEdit, setActivateEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [id, setId] = useState(localStorage.getItem("_id"));

  useEffect(() => {
    if (!accessToken || !id) return; // 👈 skip until both exist

    const fetchUser = async () => {
      try {
        const userData = await getUserById({ accessToken, id });
        setUser(userData.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [accessToken, id]);

  const handleActivateEdit = () => {
    setActivateEdit(!activateEdit);
  };

  const handleCancelEdit = () => {
    setActivateEdit(false);
  };

  const handleSaveEdit = () => {
    setActivateEdit(false);
  };

  return (
    user && (
      <div>
        <h2 className="text-3xl font-bold h-10 items-center flex">Profile</h2>
        <p className="text-gray-600">Manage profile details.</p>
        <div className="grid grid-cols-2 gap-5 mt-5">
          {/* Username & Email */}
          <div className="col-span-2 relative border border-gray-300 rounded-md flex flex-col lg:flex-row items-center p-5 gap-4">
            {user.avatar_url === "" ? (
              <Avatar size={80} icon={<User />} />
            ) : (
              <Avatar size={80} icon={<User />} src={user.avatar_url} />
            )}

            <div className="flex flex-col gap-2">
              <div className="flex flex-col lg:flex-row items-center gap-2">
                <h2 className="font-bold text-2xl">{user.username}</h2>
                <p className="flex items-center gap-0.5 bg-black rounded-full py-1 px-2 text-white font-medium text-xs">
                  <Shield size={12} />
                  {user.role}
                </p>
                {user.isActive ? (
                  <p className="bg-green-50 text-green-600 border border-green-500 px-2 py-1 rounded-full text-xs">
                    Active
                  </p>
                ) : (
                  <p className="bg-red-50 text-red-600 border border-red-500 px-2 py-1 rounded-full text-xs">
                    Banned
                  </p>
                )}
              </div>
              <p className="flex items-center gap-1 text-black/60 whitespace-nowrap">
                <Mail size={14} />
                {user.email}
              </p>
              <p className="flex items-center gap-1 text-black/60 whitespace-nowrap">
                <User size={14} />
                ID: {user._id}
              </p>
            </div>
            {activateEdit ? (
              <div className="static lg:absolute right-[20px] top-[20px] flex gap-2">
                <button
                  className="flex items-center gap-2 border border-gray-300 py-2 px-3 rounded-md font-medium text-sm hover:bg-gray-100 transition-all hover:cursor-pointer"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="flex items-center gap-2 border border-gray-300 py-2 px-3 rounded-md font-medium text-sm hover:bg-gray-100 transition-all hover:cursor-pointer"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 border border-gray-300 static lg:absolute right-[20px] top-[20px] py-2 px-3 rounded-md font-medium text-sm hover:bg-gray-100 transition-all hover:cursor-pointer"
                onClick={handleActivateEdit}
              >
                <Edit size={16} />
                Edit Profile
              </button>
            )}
          </div>
          {/* Basic Information */}
          <div className="col-span-2 p-5 relative border border-gray-300 rounded-md">
            <h2 className="flex items-center gap-1 ">
              <User />
              <span className="font-bold text-xl whitespace-nowrap">
                Personal Information
              </span>
            </h2>
            <p className="text-sm text-black/60 mb-4">Basic personal details</p>
            <ul>
              <li className="flex justify-between">
                <label
                  htmlFor="dob"
                  className="text-sm font-medium text-black/60"
                >
                  Date of Birth
                </label>
                <input
                  type="text"
                  id="dob"
                  defaultValue={user.dob}
                  className="text-md text-end"
                  disabled={!activateEdit}
                />
              </li>
              <Divider size="small" />
              <li className="flex justify-between">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-black/60"
                >
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  defaultValue={user.gender}
                  className="text-md text-end"
                  disabled={!activateEdit}
                />
              </li>
              <Divider size="small" />
              <li className="flex justify-between">
                <label
                  htmlFor="height"
                  className="text-sm font-medium text-black/60"
                >
                  Height
                </label>
                <input
                  type="text"
                  id="height"
                  defaultValue={`${user.height} cm`}
                  className="text-md text-end"
                  disabled={!activateEdit}
                />
              </li>
              <Divider size="small" />
              <li className="flex justify-between">
                <label
                  htmlFor="weight"
                  className="text-sm font-medium text-black/60"
                >
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  defaultValue={`${user.weight} kg`}
                  className="text-md text-end"
                  disabled={!activateEdit}
                />
              </li>
            </ul>
          </div>
          {/* Health & Activity */}
          <div className="col-span-2 p-5 relative border border-gray-300 rounded-md">
            <h2 className="flex items-center gap-1 ">
              <Target />
              <span className="font-bold text-xl">Health & Activity</span>
            </h2>
            <p className="text-sm text-black/60 mb-4">
              Fitness and health information
            </p>
            <ul>
              <li className="flex justify-between">
                <label
                  htmlFor="calorieLimit"
                  className="text-sm font-medium text-black/60"
                >
                  Daily Calorie Limit
                </label>
                <input
                  type="text"
                  id="calorieLimit"
                  defaultValue={`${user.calorieLimit} Kcal`}
                  className="text-md text-end"
                  disabled={!activateEdit}
                />
              </li>
            </ul>
          </div>
          {/* Account Details */}
          <div className="col-span-2 p-5 relative border border-gray-300 rounded-md">
            <h2 className="flex items-center gap-1 ">
              <Target />
              <span className="font-bold text-xl">Account Details</span>
            </h2>
            <p className="text-sm text-black/60 mb-4">
              Account creation and update information
            </p>
            <ul className="flex flex-col lg:flex-row gap-10 lg:gap-50 xl:gap-90">
              <li className="flex flex-col gap-2">
                <label
                  htmlFor="createdAt"
                  className="text-sm font-medium text-black/60"
                >
                  Account Created
                </label>
                <input
                  type="text"
                  id="createdAt"
                  defaultValue={user.createdAt}
                  className="text-md"
                  disabled={!activateEdit}
                />
              </li>
              <li className="flex flex-col gap-2">
                <label
                  htmlFor="updatedAt"
                  className="text-sm font-medium text-black/60"
                >
                  Last Updated
                </label>
                <input
                  type="text"
                  id="updatedAt"
                  defaultValue={user.updatedAt}
                  className="text-md"
                  disabled={!activateEdit}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
}
