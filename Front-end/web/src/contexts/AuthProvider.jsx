import { useState, useEffect } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { getCookie, setCookie, deleteCookie } from '@/utils/cookies';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getCookie('accessToken'));

  useEffect(() => {
    if (accessToken) {
      setCookie('accessToken', accessToken, 7); // Store for 7 days
    } else {
      deleteCookie('accessToken');
    }
  }, [accessToken]);

  const login = (access) => {
    setAccessToken(access);
  };

  const loginWithGoogle = (access) => {
    setAccessToken(access);
  };

  const logout = () => {
    setAccessToken(null);
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
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
