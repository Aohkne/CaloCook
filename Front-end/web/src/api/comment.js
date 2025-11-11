import api from '@/configs/axios';

// Get all comments
export const getAllComments = async () => {
  const response = await api.get('/comment');
  return response.data;
};

// Create a new comment
export const createComment = async ({ dishId, content, parentId }) => {
  const response = await api.post('/comment', {
    dishId,
    content,
    parentId
  });
  return response.data;
};

// Get a comment by ID
export const getCommentById = async (id) => {
  const response = await api.get(`/comment/${id}`);
  return response.data;
};

// Update a comment by ID
export const updateCommentById = async (id, data) => {
  const response = await api.patch(`/comment/${id}`, data);
  return response.data;
};

// Delete a comment by ID
export const deleteCommentById = async (id) => {
  const response = await api.delete(`/comment/${id}`);
  return response.data;
};

// Get all comments for a specific comment (nested replies)
export const getAllCommentsForASpecificComment = async (id) => {
  const response = await api.get(`/comment/${id}/comments`);
  return response.data;
};

// Get all comments for a specific dish
export const getAllCommentsForASpecificDish = async (dishId) => {
  const response = await api.get(`/comment/${dishId}/dish`);
  return response.data;
};
