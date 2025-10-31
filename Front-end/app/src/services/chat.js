import api from '@services/api';

// USER CONVERSATION
export const getUserConversation = async () => {
  try {
    const response = await api.get('/chat/user-conversations');

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Get user conversation failed' };
  }
};

// SENT
export const sentMessage = async (content) => {
  try {
    const response = await api.post('/chat/message', { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Send message failed' };
  }
};

// UPDATE
export const updateMessage = async (messageId, newContent) => {
  try {
    const response = await api.put(`/chat/message/${messageId}`, {
      content: newContent
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Update message failed' };
  }
};

// RECALL
export const recallMessage = async (messageId) => {
  try {
    const response = await api.patch(`/chat/message/${messageId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Recall message failed' };
  }
};
