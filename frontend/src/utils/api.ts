import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from '../config';
/* eslint-disable import/prefer-default-export */

// export const getMessage = async () => {
//   const response = await fetch(BACKEND_URL);
//
//   const data = await response.json();
//
//   if (data.message) {
//     return data.message;
//   }
//
//   return Promise.reject('Failed to get message from backend');
// };

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.headers.hasAuthorization()) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
