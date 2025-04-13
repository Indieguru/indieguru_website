import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/profile"
import SignupPage from "./pages/SignupPage"
import BlogPage from './pages/BlogPage'; // Adjust the import path as necessary
import CommunityPage from './pages/CommunityPage'; // Import CommunityPage
import Landing from "./pages/Landing"
import ExpertDashboard from "./pages/ExpertDashboard"
import "./styles/globals.css"

function App() {
  // Add console log to verify routes are being registered
  console.log("App component rendering with routes")

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/blogpage" element={<BlogPage />} />
          <Route path="/expert" element={<ExpertDashboard />} />
          <Route path="/communitypage" element={<CommunityPage />} /> {/* Added CommunityPage route */}
        </Routes>
      </Router>
    </div>
  )
}

export default App

