import { useState, useEffect } from "react";
import axiosInstance from "../config/axios.config";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = async () => {
        try {
            await axiosInstance.get("/user/auth/check-auth");
            setIsAuthenticated(true);
        } catch (error) {
            if (error.response.status === 401) {
                await refreshAccessToken();
                try {
                    await axiosInstance.get("/user/auth/check-auth");
                    setIsAuthenticated(true);
                } catch {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await axiosInstance.post("/user/auth/refresh-token");
           
        } catch {
            console.error("Failed to refresh token.");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated };
};
