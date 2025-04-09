import { Link } from "react-router-dom";
import { LinkedinIcon, TwitterIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-blue-100 text-gray-700 px-20 py-16">
      <div className="w-full overflow-hidden mx-auto px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo & About */}
          <div>
            <h2 className="text-3xl font-bold text-black">IndieGuru</h2>
            <p className="mt-3">
              Learn from industry experts and transform your career with
              personalized mentoring.
            </p>
          </div>

          {/* Quick Links */}
          <div className="px-16">
            <h3 className="text-xl font-semibold mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-800 font-normal hover:text-gray-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-900 font-normal hover:text-gray-500">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/experts" className="text-gray-900 font-normal hover:text-gray-500">
                  Meet the Experts
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-900 font-normal hover:text-gray-500">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-black">Contact Us</h3>
            <p>info@indieguru.com</p>
            <p>555-567-8901</p>
            <p>Delhi, India</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-900 font-normal hover:text-gray-500">
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-900 font-normal hover:text-gray-500">
                <TwitterIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-300 pt-6 flex flex-col sm:flex-row justify-between text-gray-500 text-sm">
          <p>© 2025 IndieGuru. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;