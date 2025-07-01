import api from '@services/api';

// GET RANDOM DISHES 
export const getRandomDishService = async (userId, limit = 10) => {
  try {
    const response = await api.get(`/dish/random/userId/${userId}?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get random dish failed' };
  }
};



// GET ALL DISHES - Includes user's like status
export const getAllDishesService = async (page = 1, limit = 10, userId = null) => {
  try {
    let url = `/dish?page=${page}&limit=${limit}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get all dishes failed' };
  }
};

// GET INGREDIENTS
export const getIngredientsService = async (name = '') => {
  try {
    let url = '/ingredient';
    if (name.trim()) {
      url += `?name=${encodeURIComponent(name.trim())}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get ingredients failed' };
  }
};

// GET DISH DETAIL BY ID
export const getDishDetailService = async (dishId) => {
  try {
    const response = await api.get(`/dish/${dishId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get dish detail failed' };
  }
};
// GET INGREDIENTS BY DISH ID
export const getIngredientsByDishService = async (dishId) => {
  try {
    const response = await api.get(`/ingredient/by-dish/${dishId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get ingredients by dish failed' };
  }
};

// GET STEPS BY DISH ID  
export const getStepsByDishService = async (dishId) => {
  try {
    const response = await api.get(`/step/by-dish/${dishId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get steps by dish failed' };
  }
};

// GET FILTERED DISHES
export const getFilteredDishesService = async (filters = {}) => {
  try {
    if (filters.dishIds && filters.dishIds.length > 0) {
      const dishPromises = filters.dishIds.map(dishId =>
        getDishDetailService(dishId)
      );

      const dishResponses = await Promise.allSettled(dishPromises);

      const dishes = dishResponses
        .filter(response => response.status === 'fulfilled')
        .map(response => response.value.data || response.value);

      return {
        data: dishes,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: dishes.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append('page', filters.page || 1);
    queryParams.append('limit', filters.limit || 10);
    queryParams.append('sortBy', filters.sortBy || 'createdAt');
    queryParams.append('order', filters.order || 'desc');

    if (filters.userId) {
      queryParams.append('userId', filters.userId);
    }

    if (filters.name && filters.name.trim()) {
      queryParams.append('name', encodeURIComponent(filters.name.trim()));
    }

    if (filters.minCookingTime !== undefined && filters.minCookingTime !== null) {
      queryParams.append('minCookingTime', filters.minCookingTime);
    }
    if (filters.maxCookingTime !== undefined && filters.maxCookingTime !== null) {
      queryParams.append('maxCookingTime', filters.maxCookingTime);
    }

    if (filters.minCalorie !== undefined && filters.minCalorie !== null) {
      queryParams.append('minCalorie', filters.minCalorie);
    }
    if (filters.maxCalorie !== undefined && filters.maxCalorie !== null) {
      queryParams.append('maxCalorie', filters.maxCalorie);
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      filters.difficulty.forEach(diff => {
        const normalizedDiff = diff.toLowerCase();
        queryParams.append('difficulty', normalizedDiff);
      });
    }

    if (filters.isActive !== undefined) {
      queryParams.append('isActive', filters.isActive);
    }

    const url = `/dish?${queryParams.toString()}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get filtered dishes failed' };
  }
};
