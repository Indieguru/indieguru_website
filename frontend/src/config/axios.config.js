import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const refreshResponse = await axios.post("/user/auth/refresh-token", {}, { withCredentials: true });
                const { token, refreshToken } = refreshResponse.data;
                document.cookie = `token=${token}; path=/; secure; HttpOnly`;
                document.cookie = `refreshToken=${refreshToken}; path=/; secure; HttpOnly`;
                return axiosInstance(error.config);
            } catch (refreshError) {
                console.error("Failed to refresh token.");
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;