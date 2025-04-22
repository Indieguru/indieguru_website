import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import SignupPage from "./pages/SignupPage";
import BlogPage from './pages/BlogPage';
import CommunityPage from './pages/CommunityPage';
import Landing from "./pages/Landing";
import ExpertDashboard from "./pages/ExpertDashboard";
import Loader from "./components/layout/Loader";
import BookingsPage from "./pages/BookingsPage";
import ExpertPayments from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";
import AllCoursesPage from "./pages/AllCoursesPage";
import "./styles/globals.css";
import EmailSignIn from './components/auth/EmailSignIn';
import FinishSignUp from './pages/FinishSignUp';
import FinishSignIn from './pages/FinishSignin';
import BlogPost from './pages/BlogPost';
import BrowseExperts from "./pages/BrowseExperts";
import AssessmentPage from "./pages/AssessmentPage";

// RouteChangeTracker component to detect route changes
const RouteChangeTracker = ({ setLoading }) => {
  const location = useLocation();

  useEffect(() => {
    // Show loader only for the student dashboard route
    if (location.pathname === "/dashboard") {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1200); // Adjust time as needed

      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [location.pathname, setLoading]);

  return null;
};

function App() {
  // Add console log to verify routes are being registered
  console.log("App component rendering with routes");
  
  const [loading, setLoading] = useState(true);

  // Simulate initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Initial app load shows loader a bit longer
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Router>
        <RouteChangeTracker setLoading={setLoading} />
        {loading && <Loader />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blogpage" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/expert" element={<ExpertDashboard />} />
          <Route path="/communitypage" element={<CommunityPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<ExpertPayments />} />
          <Route path="/all-courses" element={<AllCoursesPage />} />
          <Route path="/browse-experts" element={<BrowseExperts />} />
          <Route path="/browse-experts/:category" element={<BrowseExperts />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="*" element={<NotFound />} />
          {/* Add more routes as needed */}
          <Route path="/email-signin" element={<EmailSignIn />} />
          <Route path="/finish-signup" element={<FinishSignUp />} />
          <Route path="/finishSignIn" element={<FinishSignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;