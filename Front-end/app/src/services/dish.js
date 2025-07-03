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

// GET FILTERED DISHES - Optimized version
// GET FILTERED DISHES - Fixed version with proper filtering
export const getFilteredDishesService = async (filters = {}) => {
  try {
    if (filters.dishIds && filters.dishIds.length > 0) {
      // Tối ưu: Gọi song song thay vì tuần tự
      const dishPromises = filters.dishIds.map(dishId =>
        getDishDetailService(dishId)
      );

      // Sử dụng Promise.allSettled với timeout để tránh chờ quá lâu
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 10000) // 10s timeout
      );

      const dishResponses = await Promise.race([
        Promise.allSettled(dishPromises),
        timeoutPromise
      ]);

      let dishes = dishResponses
        .filter(response => response.status === 'fulfilled')
        .map(response => response.value.data || response.value);

      // FIXED: Apply ALL filters consistently
      dishes = applyClientSideFilters(dishes, filters);

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

    // Build query params for server-side filtering
    const queryParams = new URLSearchParams();
    queryParams.append('page', filters.page || 1);
    queryParams.append('limit', filters.limit || 10);
    queryParams.append('sortBy', filters.sortBy || 'createdAt');
    queryParams.append('order', filters.order || 'desc');

    if (filters.userId) {
      queryParams.append('userId', filters.userId);
    }

    // Add all filter parameters to query
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

    // FIXED: Apply client-side filtering consistently for name search
    // and as backup for server-side filtering
    if (response.data?.data) {
      const filteredDishes = applyClientSideFilters(response.data.data, filters);

      return {
        ...response.data,
        data: filteredDishes,
        pagination: {
          ...response.data.pagination,
          totalItems: filteredDishes.length
        }
      };
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get filtered dishes failed' };
  }
};

// ADDED: Consistent client-side filtering function
const applyClientSideFilters = (dishes, filters) => {
  let filteredDishes = [...dishes];

  // Filter by name
  if (filters.name && filters.name.trim()) {
    const searchWords = filters.name.trim().toLowerCase().split(/\s+/);
    filteredDishes = filteredDishes.filter(dish => {
      const dishName = (dish.name || '').toLowerCase();
      return searchWords.every(word => dishName.includes(word));
    });
  }

  // FIXED: Apply cooking time filter with AND logic
  if (filters.minCookingTime !== undefined || filters.maxCookingTime !== undefined) {
    filteredDishes = filteredDishes.filter(dish => {
      const cookingTime = dish.cookingTime || 0;

      // Must satisfy BOTH min AND max conditions if specified
      if (filters.minCookingTime !== undefined && cookingTime < filters.minCookingTime) {
        return false;
      }
      if (filters.maxCookingTime !== undefined && cookingTime > filters.maxCookingTime) {
        return false;
      }
      return true;
    });
  }

  // FIXED: Apply calorie filter with AND logic
  if (filters.minCalorie !== undefined || filters.maxCalorie !== undefined) {
    filteredDishes = filteredDishes.filter(dish => {
      const calorie = dish.calorie || dish.calories || 0;

      // Must satisfy BOTH min AND max conditions if specified
      if (filters.minCalorie !== undefined && calorie < filters.minCalorie) {
        return false;
      }
      if (filters.maxCalorie !== undefined && calorie > filters.maxCalorie) {
        return false;
      }
      return true;
    });
  }

  // Apply difficulty filter
  if (filters.difficulty && filters.difficulty.length > 0) {
    const normalizedDifficulties = filters.difficulty.map(d => d.toLowerCase());
    filteredDishes = filteredDishes.filter(dish => {
      const dishDifficulty = (dish.difficulty || '').toLowerCase();
      return normalizedDifficulties.includes(dishDifficulty);
    });
  }

  return filteredDishes;
};