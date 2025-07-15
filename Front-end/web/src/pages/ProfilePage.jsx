import { Avatar, Form, Input, message, Button, Upload } from "antd";
import { Edit, Mail, Shield, Target, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserById } from "../api/user";
import { useAuth } from "../components/AuthContext";
import { editProfile, uploadToCloudinary } from "../api/auth";

export default function ProfilePage() {
  const { accessToken } = useAuth();
  const [activateEdit, setActivateEdit] = useState(false);
  const [user, setUser] = useState(null);
  const [id] = useState(localStorage.getItem("_id"));
  const [form] = Form.useForm();

  useEffect(() => {
    if (!accessToken || !id) return;
    const fetchUser = async () => {
      try {
        const userData = await getUserById({ accessToken, id });
        setUser(userData.data);
        form.setFieldsValue({
          username: userData.data.username,
          email: userData.data.email,
          calorieLimit: userData.data.calorieLimit,
          avatarUrl: userData.data.avatar_url,
          gender: userData.data.gender,
          dob: userData.data.dob,
          height: userData.data.height,
          weight: userData.data.weight,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, [accessToken, id, form]);

  const handleActivateEdit = () => setActivateEdit(true);
  const handleCancelEdit = () => {
    setActivateEdit(false);
    // Reset form to original user values
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        calorieLimit: user.calorieLimit,
        avatarUrl: user.avatar_url,
        gender: user.gender,
        dob: user.dob,
        height: user.height,
        weight: user.weight,
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      await editProfile({
        accessToken,
        username: values.username,
        email: values.email,
        calorieLimit: values.calorieLimit,
        avatarUrl: values.avatarUrl,
        gender: values.gender,
        dob: values.dob,
        height: values.height,
        weight: values.weight,
      });
      message.success("Profile updated!");
      setActivateEdit(false);
      // Optionally, refetch user data
      const userData = await getUserById({ accessToken, id });
      setUser(userData.data);
    } catch (err) {
      message.error("Failed to update profile.", err);
    }
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
                <Button onClick={handleCancelEdit}>Cancel</Button>
                <Button type="primary" onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            ) : (
              <div className="static lg:absolute right-[20px] top-[20px]">
                <Button icon={<Edit size={16} />} onClick={handleActivateEdit}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
          {/* Editable Form */}
          <div className="col-span-2 p-5 relative border border-gray-300 rounded-md">
            <Form
              form={form}
              layout="vertical"
              disabled={!activateEdit}
              initialValues={{
                username: user.username,
                email: user.email,
                calorieLimit: user.calorieLimit,
                avatarUrl: user.avatar_url,
                gender: user.gender,
                dob: user.dob,
                height: user.height,
                weight: user.weight,
              }}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Avatar" name="avatarUrl">
                <Upload
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    try {
                      const url = await uploadToCloudinary({
                        accessToken,
                        file,
                      });
                      form.setFieldsValue({ avatarUrl: url });
                      message.success("Avatar uploaded successfully!");
                    } catch (err) {
                      message.error("Failed to upload avatar.", err);
                    }
                    return false; // prevent automatic upload
                  }}
                >
                  <Button>Change Avatar</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Input />
              </Form.Item>
              <Form.Item label="Date of Birth" name="dob">
                <Input />
              </Form.Item>
              <Form.Item label="Height (cm)" name="height">
                <Input />
              </Form.Item>
              <Form.Item label="Weight (kg)" name="weight">
                <Input />
              </Form.Item>
              <Form.Item label="Daily Calorie Limit" name="calorieLimit">
                <Input />
              </Form.Item>
            </Form>
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
                <Input id="createdAt" value={user.createdAt} disabled />
              </li>
              <li className="flex flex-col gap-2">
                <label
                  htmlFor="updatedAt"
                  className="text-sm font-medium text-black/60"
                >
                  Last Updated
                </label>
                <Input id="updatedAt" value={user.updatedAt} disabled />
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  );
}
