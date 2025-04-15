import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Assuming the hook is located here

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth(); // Use the useAuth hook to check login status
  
  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <nav className="fixed top-4 left-20 right-20 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 md:px-6">
      <div className="max-w-5xl mx-auto w-full"> {/* Reduced width with max-w-5xl */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
        
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="IndieGuru" className="h-8 w-8 object-contain" />
              <span className="ml-2 text-lg font-semibold text-gray-900">IndieGuru</span>
            </Link>
            ) : (
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="IndieGuru" className="h-8 w-8 object-contain" />
              <span className="ml-2 text-lg font-semibold text-gray-900">IndieGuru</span>
            </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/blogpage" className="text-gray-600 hover:text-gray-900">Blogs</Link>
            {/* <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link> */}
            <Link to="/communitypage" className="text-gray-600 hover:text-gray-900">Community</Link>
            {/* <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact Us</Link> */}
            {isAuthenticated ? (
              <Link to="/profile" className="px-6 py-2 rounded-full border-2 border-primary text-primary hover:bg-gray-200 hover:transition-colors">
                Profile
              </Link>
            ) : (
              <Link to="/signup" className="px-6 py-2 rounded-full border-2 border-primary bg-blue-900 text-white hover:bg-gray-400 hover:bg-blue-800 hover:text-white transition-colors">
                SignUp
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none bg-transparent"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
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
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col py-2">
            <Link to="/blogpage" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-6 py-3 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Blogs
            </Link>
            <Link to="/about" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-6 py-3 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link to="/communitypage" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-6 py-3 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Community
            </Link>
            <Link to="/contact" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-6 py-3 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            {isAuthenticated ? (
              <Link to="/profile" 
                className="text-primary hover:bg-primary hover:text-white px-6 py-3 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link to="/login" 
                className="text-primary hover:bg-primary hover:text-white px-6 py-3 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;