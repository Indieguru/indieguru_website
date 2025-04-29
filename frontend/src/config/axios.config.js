import axios from "axios";

console.log(`${import.meta.env.VITE_BACKEND_URL}`)

let backendUrl = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}/api/v1`;
if(import.meta.env.VITE_TYPE === 'production') 
  backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

const axiosInstance = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const refreshResponse = await axios.post(
                    `${backendUrl}/expert/auth/refresh-token`, 
                    {}, 
                    { withCredentials: true }
                );
                if (refreshResponse.data.token) {
                    return axiosInstance(error.config);
                }
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                window.location.href = '/signup'; // Changed from /login to /signup
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;