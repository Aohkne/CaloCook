import api from "./api";

export async function getStep({ accessToken, isActive, sortBy, orderBy }) {
  const params = { isActive, sortBy, orderBy };
  const response = await api.get("/step", {
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
