import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 pt-[120px] pb-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <h1 className="text-[200px] font-bold text-blue-900/5">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-[#003265]">Page Not Found</h2>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <p className="text-gray-600 text-lg mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-300"
              >
                Go to Homepage
              </Link>
              
              <div className="flex justify-center gap-4 mt-6">
                <Link 
                  to="/blogpage"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Read Blogs
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  to="/communitypage"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Join Community
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  to="/bookings"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Browse Sessions
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;