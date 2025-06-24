import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useExpertStore from '../store/expertStore';

const ExpertApprovalCheck = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData } = useExpertStore();

  useEffect(() => {
    // Check if expert data is loaded
    if (expertData) {
      console.log('Expert status:', expertData.status);
      
      // If expert status is not "approved", redirect to profile page
      if (expertData.status !== 'approved') {
        // Only show the toast if we're not already on the profile page
        if (!location.pathname.includes('/expert/profile')) {
          toast.info('Your expert profile is pending approval. You will be able to access this page once approved.', {
            position: "top-center",
            autoClose: 5000,
          });
          navigate('/expert/profile');
        }
        return;
      }
    }
  }, [expertData, navigate, location.pathname]);

  // If expertData is still loading or not available, don't render anything
  if (!expertData) {
    return null;
  }

  // If expert is not approved, don't render the children
  if (expertData.status !== 'approved') {
    return null;
  }

  // If expert is approved, render children
  return children;
};

export default ExpertApprovalCheck;