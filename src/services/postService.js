// frontend/src/services/postService.js
import axiosInstance from './axiosConfig';

export const getPosts = () => axiosInstance.get('/posts');
export const createPost = (postData) => axiosInstance.post('/posts', postData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const likePost = (postId) => axiosInstance.post(`/posts/${postId}/like`);
export const commentOnPost = (postId, commentData) => axiosInstance.post(`/posts/${postId}/comment`, commentData);
