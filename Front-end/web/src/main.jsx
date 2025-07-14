import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import DishManagementPage from "./pages/DishManagementPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RegisterPage from "./pages/RegisterPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import IngredientManagementPage from "./pages/IngredientManagementPage.jsx";
import StepManagementPage from "./pages/StepManagementPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import DishDetailPage from "./pages/DishDetailPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "forgotPassword/:token",
    element: <ResetPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <App />,
        children: [{ path: "", element: <DashboardPage /> }],
      },
      {
        path: "/user",
        element: <App />,
        children: [{ path: "", element: <UserManagementPage /> }],
      },
      {
        path: "/dish",
        element: <App />,
        children: [
          { path: "", element: <DishManagementPage /> },
          {
            path: ":id",
            element: <DishDetailPage />,
          },
        ],
      },
      {
        path: "/ingredient",
        element: <App />,
        children: [{ path: "", element: <IngredientManagementPage /> }],
      },
      {
        path: "/step",
        element: <App />,
        children: [{ path: "", element: <StepManagementPage /> }],
      },
      {
        path: "/profile",
        element: <App />,
        children: [{ path: "", element: <ProfilePage /> }],
      },
    ],
  },
]);
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
