import api from '@/configs/axios';

export const getReports = async (params = {}) => {
  // Forward all provided params (page, limit, filters...) to the backend
  const response = await api.get('/report', { params });
  return response.data;
};
export const createReport = async (data) => {
  const response = await api.post('/report', data);
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

export const exportReport = async (params = {}) => {
  const { dishName = '', type = 'excel' } = params;

  const queryParams = {};
  if (dishName) queryParams.dishName = dishName;

  const response = await api.get(`/report/export/${type}`, { params: queryParams, responseType: 'blob' });

  //  URL + trigger download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `reports_${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'csv'}`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return { message: 'Export successful' };
};
