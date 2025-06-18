import api from '@services/api';

export async function getAllDish(page = 1, limit = 10) {
  console.log(123);

  try {
    const response = await api.get('/dish', {
      params: { page, limit }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch dishes:', error);
    return null;
  }
}
