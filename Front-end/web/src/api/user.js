import api from "./api";

/**
 * Fetches user data from the API.
 * @param {Object} params - The parameters for fetching users.
 * @param {string} [params.username] - The username to filter by.
 * @param {string} [params.email] - The email to filter by.
 * @param {boolean} [params.isActive] - Filter by active status.
 * @param {string} [params.sortBy] - The field to sort by.
 * @param {string} [params.order] - The sort order ('asc' or 'desc').
 * @returns {Promise<Object>} The user data returned from the API.
 */
export async function getUser({ username, email, isActive, sortBy, order }) {
  console.log(
    `[getUser] Fetching user username: ${username}, email: ${email}, isActive: ${isActive}, sortBy: ${sortBy}, order: ${order}`
  );
  const params = {};
  if (username) params.username = username;
  if (email) params.email = email;
  if (isActive != null) params.isActive = isActive;
  if (sortBy) params.sortBy = sortBy;
  if (order) params.order = order;

  const response = await api.get("/user", { params });
  return response.data;
}

export async function activateUser({ id }) {
  console.log(`[activateUser] user with id: ${id} activated`);
  const response = await api.patch(`/user/${id}/activate`);
  return response.data;
}

export async function deactivateUser({ id }) {
  console.log(`[deactivateUser] user with id: ${id} deactivated`);
  const response = await api.patch(`/user/${id}/deactivate`);
  return response.data;
}
