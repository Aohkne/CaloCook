import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { changePassword } from "../api/auth"; // You need to implement this API call
import { handleApiError } from "../utils/handleApiError";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await changePassword({ token, password: values.password });
      message.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (error) {
      handleApiError(error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#FCFAF3] h-screen flex items-center justify-center">
      <Form
        name="reset-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 343,
          padding: 32,
          borderRadius: 16,
        }}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Enter New Password
        </h2>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
          hasFeedback
        >
          <Input.Password
            style={{
              width: 343,
              height: 51,
              borderRadius: 16,
              backgroundColor: "#F2F1EB",
              fontWeight: 500,
            }}
            placeholder="New Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              backgroundColor: "#006955",
              width: 343,
              height: 51,
              borderRadius: 76,
              color: "white",
              fontWeight: 600,
            }}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
