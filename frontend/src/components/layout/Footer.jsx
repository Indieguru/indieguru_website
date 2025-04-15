import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800">IndieGuru</h2>
            <p className="mt-3 text-gray-600 max-w-xs">
              Learn from industry experts and transform your career with
              personalized mentoring.
            </p>
            <div className="mt-4 flex space-x-3">
              <a 
                href="#" 
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-full transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/experts" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Meet the Experts
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Support
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
                  <span className="bg-blue-50 w-1 h-1 rounded-full mr-2"></span>
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-blue-600" />
                <p className="text-gray-600">info@indieguru.com</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-blue-600" />
                <p className="text-gray-600">555-567-8901</p>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                <p className="text-gray-600">Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter - Optional */}
        {/* <div className="mt-12 border-t border-blue-200 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold text-blue-800">Subscribe to our newsletter</h4>
              <p className="text-gray-600 text-sm">Stay updated with the latest industry insights and tips</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 border border-blue-200 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-blue-200 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p className="mb-4 md:mb-0">© 2025 IndieGuru. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/privacy" className="hover:text-blue-700 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-700 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-blue-700 transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;