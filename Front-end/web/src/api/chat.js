import api from '@/configs/axios';

export const getUserConversation = async () => {
  const response = await api.get(`/chat/user-conversations`);

  return response.data;
};

export const sentMessage = async (content) => {
  const response = await api.post('/chat/message', {
    content
  });
  return response.data;
};

export const deactivateMessage = async (messageId) => {
  const response = await api.patch(`/chat/message/${messageId}`);
  return response.data;
};
