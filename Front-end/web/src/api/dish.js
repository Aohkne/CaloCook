import api from "./api";

export async function getDish({
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

  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;
  if (name) params.name = name;
  if (minCookingTime) params.minCookingTime = minCookingTime;
  if (maxCookingTime) params.maxCookingTime = maxCookingTime;
  if (minCalorie) params.minCalorie = minCalorie;
  if (maxCalorie) params.maxCalorie = maxCalorie;
  if (difficulty) params.difficulty = difficulty;
  if (isActive !== undefined) params.isActive = isActive;

  const response = await api.get("/dish", { params });
  return response.data;
}

export async function addDish({
  name,
  cookingTime,
  calorie,
  difficulty,
  description,
  imageUrl,
  isActive,
}) {
  const params = {};
  if (name) params.name = name;
  if (cookingTime) params.cookingTime = cookingTime;
  if (calorie) params.calorie = calorie;
  if (difficulty) params.difficulty = difficulty;
  if (description) params.description = description;
  if (imageUrl) params.imageUrl = imageUrl;
  if (isActive != null) params.isActive = isActive;

  const response = await api.post("/dish", params);
  return response.data;
}

export async function activateDish({ id }) {
  const response = await api.patch(`/dish/${id}/activate`);
  return response.data;
}
export async function deactivateDish({ id }) {
  const response = await api.patch(`/dish/${id}/deactivate`);
  return response.data;
}
