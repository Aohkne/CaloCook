import api from '@/configs/axios';

export const getAdminConversation = async () => {
  const response = await api.get(`/chat/conversations`);
  return response.data;
};

export const getUserConversation = async () => {
  const response = await api.get(`/chat/user-conversations`);
  return response.data;
};

export const getDetailConversation = async (conversationId) => {
  const response = await api.get(`/chat/conversation?conversationId=${conversationId}`);
  return response.data;
};

export const sentMessage = async (content) => {
  const response = await api.post('/chat/message', {
    content
  });
  return response.data;
};

export const adminSentMessage = async (readerId, content) => {
  const response = await api.post('/chat/message', {
    readerId,
    content
  });
  return response.data;
};

export const updateMessage = async (messageId, newContent) => {
  const response = await api.put(`/chat/message/${messageId}`, {
    content: newContent
  });
  return response.data;
};

export const recallMessage = async (messageId) => {
  const response = await api.patch(`/chat/message/${messageId}`);
  return response.data;
};
