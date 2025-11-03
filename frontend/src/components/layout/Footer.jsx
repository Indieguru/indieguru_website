import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-yellow-50/30 to-yellow-100/20 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-between">
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">IndieGuru</h2>
            <p className="mt-3 text-gray-500 max-w-xs">
              Learn from industry experts and transform your career with personalized mentoring.
            </p>
            <div className="mt-4 flex space-x-3">
              <a 
                href="https://www.linkedin.com/company/indieguru/posts/?feedView=all" 
                className="bg-gray-100 hover:bg-indigo-100 text-indigo-700 p-2 rounded-full transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-gray-100 hover:bg-indigo-100 text-indigo-700 p-2 rounded-full transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/myindieguru/" 
                className="bg-gray-100 hover:bg-indigo-100 text-indigo-700 p-2 rounded-full transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex justify-center">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/all-courses" className="text-gray-500 hover:text-indigo-700 transition-colors duration-200 flex items-center">
                    <span className="bg-gray-200 w-1 h-1 rounded-full mr-2"></span>
                    Courses
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-500 hover:text-indigo-700 transition-colors duration-200 flex items-center">
                    <span className="bg-gray-200 w-1 h-1 rounded-full mr-2"></span>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-gray-500 hover:text-indigo-700 transition-colors duration-200 flex items-center">
                    <span className="bg-gray-200 w-1 h-1 rounded-full mr-2"></span>
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex justify-end">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-900">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-indigo-600" />
                  <p className="text-gray-500">Team@myindieguru.com</p>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-indigo-600" />
                  <p className="text-gray-500">+91 8006335334</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-indigo-600" />
                  <p className="text-gray-500">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="mb-4 md:mb-0">© 2025 IndieGuru. All rights reserved.</p>
          <p className="mb-4 md:mb-0">Made with ❤️ by IndieGuru</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
