import axios from 'axios';

const API_URL = 'http://localhost:8081/api/notifications';

export const getNotifications = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const getUnreadNotifications = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}/unread`);
  return response.data;
};

export const markAsRead = async (notificationId, userId) => {
  const response = await axios.put(`${API_URL}/${notificationId}/mark-as-read?userId=${userId}`);
  return response.data;
};

export const markAllAsRead = async (userId) => {
  const response = await axios.put(`${API_URL}/user/${userId}/mark-all-as-read`);
  return response.data;
};

export const deleteNotification = async (notificationId, userId) => {
  const response = await axios.delete(`${API_URL}/${notificationId}?userId=${userId}`);
  return response.data;
};
