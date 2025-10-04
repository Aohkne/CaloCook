import api from '@/configs/axios';

export const getReports = async (params = {}) => {
  // Forward all provided params (page, limit, filters...) to the backend
  const response = await api.get('/report', { params });
  return response.data;
};
export const deleteReport = async (id) => {
  const response = await api.delete(`/report/${id}`);
  return response.data;
};
export const updateReport = async (id) => {
  const response = await api.patch(`/report/${id}`);
  return response.data;
};
