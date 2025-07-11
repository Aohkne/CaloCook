import api from "./api";

export async function getDish({
  accessToken,
  page,
  limit,
  sortBy,
  order,
  name,
  minCookingTime,
  maxCookingTime,
  minCalorie,
  maxCalorie,
  difficulty,
  isActive,
}) {
  console.log(`[getDish] Fetching dish`);

  const params = {
    page,
    limit,
    sortBy,
    order,
    name,
    minCookingTime,
    maxCookingTime,
    minCalorie,
    maxCalorie,
    difficulty,
    isActive,
  };

  const response = await api.get("/dish", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function addDish({
  accessToken,
  name,
  cookingTime,
  calorie,
  difficulty,
  description,
  imageUrl,
  isActive,
}) {
  const params = {
    name,
    cookingTime,
    calorie,
    difficulty,
    description,
    imageUrl,
    isActive,
  };

  const response = await api.post("/dish", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function getDishById({ accessToken, id }) {
  const response = await api.get(`/dish/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function editDishById({
  accessToken,
  id,
  name,
  cookingTime,
  calorie,
  difficulty,
  description,
  imageUrl,
  isActive,
}) {
  const params = {
    name,
    cookingTime,
    calorie,
    difficulty,
    description,
    imageUrl,
    isActive,
  };
  const response = await api.put(`/dish/${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function activateDish({ accessToken, id }) {
  const response = await api.patch(
    `/dish/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}

export async function deactivateDish({ accessToken, id }) {
  const response = await api.patch(
    `/dish/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
