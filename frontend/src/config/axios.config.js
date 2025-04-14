import axios from "axios";

console.log(`${import.meta.env.VITE_BACKEND_URL}`)

let backendUrl = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/api/v1`;
if(import.meta.env.VITE_TYPE === 'production') 
backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;


const axiosInstance = axios.create({
    baseURL: backendUrl, // Use environment variable for backend URL and port
    withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         if (error.response.status === 401) {
//             try {
//                 const refreshResponse = await axios.post(`${backendUrl}/user/auth/refresh-token`, {}, { withCredentials: true });
//                 const { token, refreshToken } = refreshResponse.data;
//                 document.cookie = `token=${token}; path=/; secure; HttpOnly`;
//                 document.cookie = `refreshToken=${refreshToken}; path=/; secure; HttpOnly`;
//                 return axiosInstance(error.config);
//             } catch (refreshError) {
//                 console.error("Failed to refresh token.");
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;