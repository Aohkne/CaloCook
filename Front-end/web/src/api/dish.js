import api from "./api";

export async function getAllDish() {
  try {
    const response = await api.get("/dish");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch dishes:", error);
    return null;
  }
}
