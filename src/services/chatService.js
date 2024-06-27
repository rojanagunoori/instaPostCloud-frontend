// frontend/src/services/chatService.js
import axiosInstance from './axiosConfig';

export const getMessages = (userId) => axiosInstance.get(`/chats/${userId}`);
export const sendMessage = (userId, messageData) => axiosInstance.post(`/chats/${userId}`, messageData);
