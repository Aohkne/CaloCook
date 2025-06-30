import api from "./api";

export async function login({ emailOrUsername, password }) {
  const params = { emailOrUsername, password };
  const response = await api.post("/auth/login", params);
  return response.data;
}

export async function logout({ accessToken, refreshToken }) {
  const params = { refreshToken };
  const response = await api.post("/auth/logout", params, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
}
