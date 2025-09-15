import { useState, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getCookie, setCookie, deleteCookie } from '@/utils/cookies';
import { logout as logoutAPI } from '@/api/auth';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getCookie('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => getCookie('refreshToken'));
  const [userRole, setUserRole] = useState(() => getCookie('userRole'));

  useEffect(() => {
    if (accessToken) {
      setCookie('accessToken', accessToken, 7);
    } else {
      deleteCookie('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      setCookie('refreshToken', refreshToken, 30); // Refresh token thường sống lâu hơn
    } else {
      deleteCookie('refreshToken');
    }
  }, [refreshToken]);

  useEffect(() => {
    if (userRole) {
      setCookie('userRole', userRole, 7);
    } else {
      deleteCookie('userRole');
    }
  }, [userRole]);

  const login = (access, refresh, role) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUserRole(role);
  };

  const loginWithGoogle = (access, refresh, role) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setUserRole(role);
  };

  const logout = async () => {
    try {
      // Gọi API logout với refreshToken
      if (refreshToken) {
        await logoutAPI(refreshToken);
      }
    } catch (error) {
      // Nếu API lỗi, vẫn tiếp tục xóa client tokens
      console.warn('Logout API failed:', error);
    } finally {
      // Luôn xóa tokens ở client
      setAccessToken(null);
      setRefreshToken(null);
      setUserRole(null);
    }
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userRole,
        login,
        logout,
        loginWithGoogle,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
