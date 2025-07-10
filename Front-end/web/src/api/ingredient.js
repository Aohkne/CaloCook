import api from "./api";

export async function getIngredients({ accessToken, isActive, sortBy, order }) {
  const params = { isActive, sortBy, order };
  const response = await api.get("/ingredient", {
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
  const response = await api.post("/ingredient", {
    params,
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
