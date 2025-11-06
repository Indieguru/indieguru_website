import { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import useExpertStore from '../store/expertStore';
import useUserTypeStore from '../store/userTypeStore';
import checkAuth from '../utils/checkAuth';

/**
 * Custom hook to handle authentication and user data loading
 * Returns loading state and user information
 */
const useAuthLoading = (minLoadingTime = 1000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [minLoadingComplete, setMinLoadingComplete] = useState(false);
  const { user, fetchUser } = useUserStore();
  const { expertData, fetchExpertData } = useExpertStore();
  const { userType, setUserType } = useUserTypeStore();

  // Check authentication
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth(setUserType);
    };
    initAuth();
  }, [setUserType]);

  // Set minimum loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingComplete(true);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, [minLoadingTime]);

  // Fetch user/expert data when userType changes
  useEffect(() => {
    const fetchData = async () => {
      if (userType === 'student') {
        await fetchUser();
        setTimeout(() => setIsLoading(false), 300);
      } else if (userType === 'expert') {
        await fetchExpertData();
        setTimeout(() => setIsLoading(false), 300);
      } else if (userType === 'not_signed_in') {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userType, fetchUser, fetchExpertData]);

  const shouldShowLoading = isLoading || !minLoadingComplete;
  const isAuthenticated = userType !== "not_signed_in";
  const userData = userType === 'expert' ? expertData : user;

  return {
    isLoading: shouldShowLoading,
    isAuthenticated,
    userType,
    user,
    expertData,
    userData
  };
};

export default useAuthLoading;
