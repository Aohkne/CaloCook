import api from "./api";

export async function getAllUsers() {
  try {
    const response = await api.get("/user");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return null;
  }
}
