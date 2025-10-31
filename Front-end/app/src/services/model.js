import api from '@/services/api_ai';

export const getStatus = async () => {
  try {
    const response = await api.get('/status');
    console.log('Status API response:', response.data);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Status API timeout:', error.message);
    }
    console.error('Status API Error - request:', error.request);
    console.error('Status API Error - config:', error.config);
    throw error.response?.data || { message: 'Get status failed models fail' };
  }
};

export const analyzeImageService = async (formData) => {
  try {
    const response = await api.post('/calobot', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log(response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('Request error:', error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log('Config:', error.config);

    throw error.response?.data || { message: 'Image analysis failed' };
  }
};
