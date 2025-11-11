import api from '@/configs/axios';

// ✅ Get all reactions
export const getAllReactions = async () => {
  const response = await api.get('/reaction');
  return response.data;
};

// ✅ Add a reaction
export const addReaction = async ({ commentId, reactionType }) => {
  const response = await api.post('/reaction', { commentId, reactionType });
  return response.data;
};

// ✅ Update a reaction by ID
export const updateReactionById = async (id, data) => {
  const response = await api.patch(`/reaction/${id}`, data);
  return response.data;
};

// ✅ Delete a reaction by ID
export const deleteReactionById = async (id) => {
  const response = await api.delete(`/reaction/${id}`);
  return response.data;
};

// ✅ Get reactions by comment ID
export const getAllReactionsForASpecificComment = async (commentId) => {
  const response = await api.get(`/reaction/${commentId}`);
  return response.data;
};
