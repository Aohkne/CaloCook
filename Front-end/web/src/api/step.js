import api from "./api";

export async function getStep({
  accessToken,
  isActive,
  sortBy = "stepNumber",
  order = "asc",
}) {
  const params = { isActive, sortBy, order };
  const response = await api.get("/step", {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function getStepByDishId({
  accessToken,
  dishId,
  sortBy = "stepNumber",
  order = "asc",
}) {
  const params = { dishId, sortBy, order };
  const response = await api.get(`/step/by-dish/${dishId}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function addStep({
  accessToken,
  dishId,
  stepNumber,
  description,
  isActive,
}) {
  const params = { dishId, stepNumber, description, isActive };
  const response = await api.post("/step", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function editStep({
  accessToken,
  id,
  dishId,
  stepNumber,
  description,
  isActive,
}) {
  const params = { dishId, stepNumber, description, isActive };
  const response = await api.put(`/step/${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function activateStep({ accessToken, id }) {
  const response = await api.patch(
    `/step/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}

export async function deactivateStep({ accessToken, id }) {
  const response = await api.patch(
    `/step/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
}
