import api from "./api";

export async function getIngredients({
  accessToken,
  isActive,
  sortBy = "createdAt",
  order = "desc",
}) {
  const params = { isActive, sortBy, order };
  const response = await api.get("/ingredient", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function getIngredientsByDishId({
  accessToken,
  dishId,
  sortBy = "createdAt",
  order = "desc",
}) {
  const params = { dishId, sortBy, order };
  const response = await api.get(`/ingredient/by-dish/${dishId}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function addIngredient({
  accessToken,
  dishId,
  name,
  quantity,
  isActive,
}) {
  const params = { dishId, name, quantity, isActive };
  const response = await api.post("/ingredient", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function editIngredient({
  accessToken,
  id,
  dishId,
  name,
  quantity,
  isActive,
}) {
  const params = { dishId, name, quantity, isActive };
  const response = await api.put(`/ingredient/${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function activateIngredient({ accessToken, id }) {
  const response = await api.patch(
    `/ingredient/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}

export async function deactivateIngredient({ accessToken, id }) {
  const response = await api.patch(
    `/ingredient/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
