import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import SignupPage from "./pages/SignupPage";
import BlogPage from './pages/BlogPage';
import CommunityPage from './pages/CommunityPage';
import Landing from "./pages/Landing";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfile from "./pages/ExpertProfile";
import Loader from "./components/layout/Loader";
import BookingsPage from "./pages/BookingsPage";
import StudentBookingsPage from "./pages/StudentBookingsPage";
import ExpertPayments from "./pages/PaymentsPage";
import NotFound from "./pages/NotFound";
import AllCoursesPage from "./pages/AllCoursesPage";
import "./styles/globals.css";
import EmailSignIn from './components/auth/EmailSignIn';
import FinishSignUp from './pages/FinishSignUp';
import FinishSignIn from './pages/FinishSignin';
import BlogPost from './pages/BlogPost';
import BrowseExperts from "./pages/BrowseExperts";
import CourseDetails from "./pages/CourseDetails";
import BookingPage from "./pages/BookingPage";
import CohortDetails from "./pages/CohortDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/profile" element={<ExpertProfile />} />
        <Route path="/expert/payments" element={<ExpertPayments />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/student/bookings" element={<StudentBookingsPage />} />
        <Route path="/all-courses" element={<AllCoursesPage />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/cohort/:cohortId" element={<CohortDetails />} />
        <Route path="/booking/:expertId" element={<BookingPage />} />
        <Route path="/finish-signup" element={<FinishSignUp />} />
        <Route path="/finish-signin" element={<FinishSignIn />} />
        <Route path="/browse-experts" element={<BrowseExperts />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;