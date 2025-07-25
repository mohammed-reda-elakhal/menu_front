import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://menu-back-end.onrender.com/api/v1',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // Increase timeout to 30 seconds
  timeoutErrorMessage: 'Request timed out'
});

// Add a request interceptor to add Authorization header
request.interceptors.request.use(
  (config) => {


    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    // Error handling without console logs

    return Promise.reject(error);
  }
);

export default request;
