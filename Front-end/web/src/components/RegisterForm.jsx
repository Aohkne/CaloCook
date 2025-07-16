import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import logoFull from "../assets/logo-full.png";
import { register } from "../api/auth";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
export default function RegisterForm() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
      handleApiError(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      style={{ userSelect: "none" }}
    >
      <Link
        className="absolute top-5 left-2 flex items-center hover:cursor-pointer"
        to="/login"
      >
        <ChevronLeft color="#006955" />
        <p className=" text-[#006955]">Back to Login</p>
      </Link>
      <img src={logoFull} className="w-[250px] mx-auto mb-7" />

      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username" }]}
      >
        <Input
          autoComplete="username"
          placeholder="Username"
          style={{
            width: 343,
            height: 51,
            borderRadius: 16,
            backgroundColor: "#F2F1EB",
            fontWeight: 500,
          }}
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your email" }]}
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
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password
          autoComplete="current-password"
          placeholder="Password"
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
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  );
}
