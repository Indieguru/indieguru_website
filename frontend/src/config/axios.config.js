import axios from "axios";

console.log(`${import.meta.env.VITE_BACKEND_URL}`)

let backendUrl = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/api/v1`;
if(import.meta.env.VITE_TYPE === 'production') 
  backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

export default axiosInstance;