import axios from 'axios';
// export const baseURLclient = 'http://localhost:3001';
// export const baseURL = 'http://localhost:3031';
// //VM
// export const baseURLclient = 'http://192.168.4.242:3001';
// export const baseURL = 'http://192.168.4.242:3031';
// // //Laptop
export const baseURLclient = 'http://192.168.5.92:4001';
export const baseURL = 'http://192.168.5.92:3040';
// Create a base Axios instance with default configurations
const apiClient = axios.create({
  baseURL: `${baseURL}/`, // Replace with your API's base URL
  // timeout: 10000, // Set a default timeout for requests
  headers: {
    'Content-Type': 'application/json', // Set default Content-Type for requests
  },
});

apiClient.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem('user')); // Parse user object from localStorage
      if (user?.token && !config.url.includes('/user/login')) {
        // Add Authorization header only if the request is NOT for login
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      if (user?.email) {
        config.headers['x-user-email'] = user.email; // ✅ Add this line
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);
  


export default apiClient;
