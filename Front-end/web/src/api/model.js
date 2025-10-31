import api from '@/configs/axios_ai';

export const analyzeImage = async (formData) => {
  const response = await api.post('/calobot', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
