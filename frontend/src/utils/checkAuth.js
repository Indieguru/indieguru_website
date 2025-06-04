import axiosInstance from '../config/axios.config';

const checkAuth = async (setUserType, setLoading) => {
  try {
    setLoading?.(true);

    try {
      // Try student auth first
      const studentRes = await axiosInstance.get("/user/auth/check-auth");
      if (studentRes.status === 200) {
        setUserType("student");
        return studentRes.data;
      }
    } catch (error) {
      console.log("Student auth check failed, trying expert auth");
    }

    try {
      // Try expert auth if student auth failed
      const expertRes = await axiosInstance.get("/expert/auth/check-auth");
      if (expertRes.status === 200) {
        setUserType("expert");
        return expertRes.data;
      }
    } catch (error) {
      console.log("Expert auth check failed");
    }

    // If both checks fail, user is not signed in
    setUserType("not_signed_in");
    return null;

  } catch (error) {
    console.error("Error in checkAuth:", error);
    setUserType("not_signed_in");
    return null;
  } finally {
    setLoading?.(false);
  }
};

export default checkAuth;