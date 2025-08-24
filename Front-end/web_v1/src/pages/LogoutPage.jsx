import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { logout as apiLogout } from "../api/auth";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { accessToken, refreshToken, logout } = useAuth();

  useEffect(() => {
    async function doLogout() {
      try {
        await apiLogout({ accessToken, refreshToken });
      } catch (error) {
        console.error("Logout failed:", error);
      }
      logout(); // Clear context and localStorage
      navigate("/login", { replace: true });
    }
    doLogout();
    // eslint-disable-next-line
  }, []);

  return <div>Logging out...</div>;
}
