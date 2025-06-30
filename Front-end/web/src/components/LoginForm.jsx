import { Button, Form, Input } from "antd";
import logoFull from "../assets/logo-full.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { login as apiLogin } from "../api/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const result = await apiLogin({
        emailOrUsername: values.emailOrUsername,
        password: values.password,
      });
      localStorage.setItem("_id", result._id);
      login(result.accessToken, result.refreshToken);
      navigate("/users", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="login"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <img src={logoFull} className="w-[250px] mx-auto mb-7" />

      <Form.Item
        name="emailOrUsername"
        rules={[
          { required: true, message: "Please input your username or email!" },
        ]}
      >
        <Input
          autoComplete="username"
          placeholder="Email or Username"
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
        style={{ height: 30 }}
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
      <Form.Item
        name="forgot-password"
        style={{ justifyItems: "end", height: 15 }}
      >
        <Link>
          <p className="text-[#006955]">Forgot Password</p>
        </Link>
      </Form.Item>
      <Form.Item style={{ height: 30 }}>
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
          Login
        </Button>
      </Form.Item>
      <div className="flex justify-center gap-4 items-center h-[35px]">
        <div className="bg-black/10 h-[2px] w-full"></div>
        <p className="text-black/50 font-semibold">OR</p>
        <div className="bg-black/10 h-[2px] w-full  "></div>
      </div>
      <Form.Item style={{ height: 40 }}>
        <Button
          style={{
            backgroundColor: "#F2F1EB",
            width: 343,
            height: 51,
            borderRadius: 76,
            fontWeight: 600,
            color: "black",
          }}
          htmlType="submit"
        >
          Google
        </Button>
      </Form.Item>
      <Form.Item>
        <p className="flex gap-1">
          Don't have an account? <Link to={"/register"}>Sign Up</Link>
        </p>
      </Form.Item>
    </Form>
  );
}
