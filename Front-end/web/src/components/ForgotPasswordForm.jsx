import { Button, Form, Input } from "antd";
import logoFull from "../assets/logo-full.png";
import { forgotPassword } from "../api/auth";
import { handleApiError } from "../utils/handleApiError";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const onFinish = async (values) => {
    try {
      await forgotPassword({
        email: values.email,
      });
      setSent(true);
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return sent ? (
    <div
      style={{
        width: 343,
        padding: 32,
        borderRadius: 16,
        textAlign: "center",
      }}
    >
      <img src={logoFull} className="w-[200px] mx-auto mb-7" alt="Logo" />
      <h2 className="text-2xl font-bold mb-2">Check your email</h2>
      <p>We've sent you an email to reset your password!</p>
    </div>
  ) : (
    <Form
      name="forgot-password"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img src={logoFull} className="w-[250px] mx-auto mb-7" alt="Logo" />
      <h2 className="text-2xl font-bold mb-2 text-center">
        Forgot Your Password?
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input
          autoComplete="email"
          placeholder="Email"
          style={{
            width: 343,
            height: 51,
            borderRadius: 16,
            backgroundColor: "#F2F1EB",
            fontWeight: 500,
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          style={{
            backgroundColor: "#006955",
            width: 343,
            height: 51,
            borderRadius: 76,
            color: "white",
            fontWeight: 600,
          }}
          htmlType="submit"
        >
          Send
        </Button>
      </Form.Item>
    </Form>
  );
}
