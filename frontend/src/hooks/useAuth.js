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

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated };
};
