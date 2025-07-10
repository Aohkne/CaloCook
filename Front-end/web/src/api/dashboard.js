import api from "./api";

export async function userCount(accessToken) {
  const response = await api.get("/dashboard/user-count", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function dishCount(accessToken) {
  const response = await api.get("/dashboard/dish-count", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
