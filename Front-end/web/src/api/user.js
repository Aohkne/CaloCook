import api from "./api";

export async function getUser({
  accessToken,
  username,
  email,
  isActive,
  sortBy,
  order,
}) {
  console.log(`[getUser] Fetching user`);
  const params = {};
  if (username) params.username = username;
  if (email) params.email = email;
  if (isActive != null) params.isActive = isActive;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;

  const response = await api.get("/user", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function getUserById({ accessToken, id }) {
  const response = await api.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function activateUser({ accessToken, id }) {
  console.log(`[activateUser] user with id: ${id} activated`);
  const response = await api.patch(`/user/${id}/activate`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function deactivateUser({ accessToken, id }) {
  console.log(`[deactivateUser] user with id: ${id} deactivated`);
  const response = await api.patch(`/user/${id}/deactivate`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}
