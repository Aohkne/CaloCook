import { Avatar, Divider } from "antd";
import { Edit, Mail, Shield, Target, User } from "lucide-react";
import { useState } from "react";

const user = {
  _id: {
    $oid: "68306f4d4928f3fe108df627",
  },
  email: "nguyenvana@example.com",
  password_hash: "$2b$10$abcdefghij1234567890mnopqrstuv",
  role: "admin",
  username: "nguyenvana",
  calorieLimit: 2200,
  avatar_url: "https://avatarfiles.alphacoders.com/337/337077.jpg",
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
};

export default function ProfilePage() {
  const [activateEdit, setActivateEdit] = useState(false);

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
    <div>
      <h2 className="text-3xl font-bold h-10 items-center flex">Profile</h2>
      <p className="text-gray-600">Manage profile details.</p>
      <div className="grid grid-cols-2 gap-5 mt-5">
        {/* Username & Email */}
        <div className="col-span-2 relative border border-gray-300 rounded-md flex items-center p-5 gap-4">
          <Avatar size={80} icon={<User />} src={user.avatar_url} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
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
            <p className="flex items-center gap-1 text-black/60">
              <Mail size={14} />
              {user.email}
            </p>
            <p className="flex items-center gap-1 text-black/60">
              <User size={14} />
              ID: {user._id.$oid}
            </p>
          </div>
          {activateEdit ? (
            <div className="absolute right-[20px] top-[20px] flex gap-2">
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
              className="flex items-center gap-2 border border-gray-300 absolute right-[20px] top-[20px] py-2 px-3 rounded-md font-medium text-sm hover:bg-gray-100 transition-all hover:cursor-pointer"
              onClick={handleActivateEdit}
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
        {/* Basic Information */}
        <div className="col-span-1 p-5 relative border border-gray-300 rounded-md">
          <h2 className="flex items-center gap-1 ">
            <User />
            <span className="font-bold text-xl">Personal Information</span>
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
        <div className="col-span-1 p-5 relative border border-gray-300 rounded-md">
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
          <ul className="flex gap-90">
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
                defaultValue={user.createdAt.$date}
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
                defaultValue={user.updatedAt.$date}
                className="text-md"
                disabled={!activateEdit}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
