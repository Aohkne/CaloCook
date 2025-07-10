import api from "./api";

export async function login({ emailOrUsername, password }) {
  const params = { emailOrUsername, password };
  const response = await api.post("/auth/login", params);
  return response.data;
}

export async function register({ username, email, password }) {
  const params = { username, email, password };
  const response = await api.post("/auth/signup", params);
  return response.data;
}

export async function forgotPassword({ email }) {
  const params = { email };
  const response = await api.post("/auth/forgot-password", params);
  return response.data;
}

export async function changePassword({ token, password }) {
  const params = { password };
  const response = await api.post(`/auth/forgot-password/${token}`, params);
  return response.data;
}

export async function loginWithGoogle(credential) {
  const params = { credential };
  const response = await api.post("/auth/google-login", params);
  return response.data;
}

export async function logout({ accessToken, refreshToken }) {
  const params = { refreshToken };
  const response = await api.post("/auth/logout", params, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
