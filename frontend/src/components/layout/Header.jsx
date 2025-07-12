import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import useExpertStore from '../../store/expertStore';
import useUserTypeStore from '../../store/userTypeStore';
import checkAuth from '../../utils/checkAuth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserStore();
  const { expertData } = useExpertStore();
  const { userType, setUserType } = useUserTypeStore();

  useEffect(() => {
    checkAuth(setUserType);
  }, [setUserType]);

  const getDashboardLink = () => {
    return userType === 'expert' ? '/expert' : '/dashboard';
  };

  const getBookingsLink = () => {
    return userType === 'student' ? '/student/bookings' : '/bookings';
  };

  const getUserData = () => {
    return userType === 'expert' ? expertData : user;
  };

  const isAuthenticated = userType !== "not_signed_in";

  return (
    <nav className="fixed top-0 left-0 right-0 md:top-4 md:left-20 md:right-20 z-50 bg-white/90 backdrop-blur-sm md:rounded-full shadow-lg px-4 md:px-6">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="IndieGuru Logo" className="h-8 w-auto" />
              <span className="text-indigo-900 text-xl font-bold">IndieGuru</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-[#232636] font-normal hover:text-[#003265] transition-all duration-200">
                  Dashboard
                </Link>
                <Link to="/community" className="text-[#232636] font-normal hover:text-[#003265] transition-all duration-200">
                  Community
                </Link>
                <Link to="/blog" className="text-[#232636] font-normal hover:text-[#003265] transition-all duration-200">
                  Blog
                </Link>
                <Link to="/all-courses" className="text-[#232636] hover:text-[#003265] transition-colors">
                  All Courses
                </Link>
                <Link to={getBookingsLink()} className="text-[#232636] hover:text-[#003265] transition-colors">
                My Bookings
                </Link>
                <Link 
                  to={userType === "student" ? "/profile" : "/expert/profile"}
                  className="flex items-center gap-2 text-[#232636] hover:text-[#003265] transition-all duration-200"
                >
                  <img 
                    src={getUserData()?.profilePicture || "/imagecopy.png"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 hover:ring-[#FFD050] transition-all duration-200"
                  />
                  <span>{getUserData()?.firstName || getUserData()?.name || "Profile"}</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/blog" className="text-[#232636] font-normal hover:text-gray-600 transition-all duration-200">
                  Blog
                </Link>
                <Link to="/community" className="text-[#232636] font-normal hover:text-[#003265] transition-all duration-200">
                  Community
                </Link>
                <Link to="/all-courses" className="text-[#232636] font-normal hover:text-[#003265] transition-all duration-200">
                  Courses
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2 bg-indigo-900 text-white font-semibold rounded-full hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                >
                  Signup/Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#232636] hover:text-indigo-700 hover:bg-gray-100 focus:outline-none bg-transparent p-2 rounded-lg transition-all duration-300 ease-in-out"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardLink()}
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/community"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/all-courses"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                All Courses
              </Link>
              <Link
                to={getBookingsLink()}
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                to={userType === "student" ? "/profile" : "/expert/profile"}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <img 
                  src={getUserData()?.profilePicture || "/imagecopy.png"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                />
                <span>{getUserData()?.firstName || getUserData()?.name || "Profile"}</span>
              </Link>
            </>            ) : (
            <>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/community"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Community
              </Link>
              <Link
                to="/all-courses"
                className="block px-3 py-2 rounded-md text-base font-normal text-[#232636] hover:text-[#003265] hover:bg-gray-50 transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/signup"
                className="block text-center mx-3 my-2 px-6 py-2 bg-indigo-900 text-white font-semibold rounded-full hover:bg-indigo-700 hover:shadow-md transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                Signup/Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;