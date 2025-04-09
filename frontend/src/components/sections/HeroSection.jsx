import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const texts = [
    "Master new technologies with",
    "Transform your career with",
    "Learn from industry experts with",
    "Get personalized guidance with",
    "Achieve your goals with",
    "Build your future with",
    "Create your success with",
    "Design your future with",
  ];

  useEffect(() => {
    setIsVisible(true);

    const typeText = () => {
      const currentText = texts[textIndex];
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      } else {
        setTimeout(() => {
          setDisplayText('');
          setTextIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
        return;
      }
    };

    const timer = setInterval(typeText, 100);
    return () => clearInterval(timer);
  }, [displayText, textIndex]);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Content Container */}
      <div className="relative h-full w-full flex items-center pt-24 sm:pt-28 lg:pt-0">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div
              className={`space-y-6 transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              {/* Reviews Section */}
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="User review"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User review"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/men/47.jpg"
                    alt="User review"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    {[1, 2, 3, 4].map((_, index) => (
                      <svg
                        key={index}
                        className="w-5 h-5 text-black-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(10k+ Reviews)</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {displayText}
                <br />
                <span className="text-primary">IndieGuru</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-gray-600">
                Join thousands of learners who have transformed their careers with personalized mentoring
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <Link
                  to="/appointment"
                  className="bg-blue-900 text-white px-6 py-3 rounded-md text-sm font-semibold text-center hover:bg-white duration-200"
                >
                  Take An Assessment
                </Link>
                <Link
                  to="/experts"
                  className="border border-blue-900 text-blue-900 px-6 py-3 rounded-md text-sm font-semibold text-center hover:bg-transparent transition-colors duration-200"
                >
                  Choose Your Expert
                </Link>
              </div>
            </div>

            {/* Right Column - Image */}
            <div
              className={`relative flex items-end justify-center h-full transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <div className="w-full max-w-md xl:max-w-lg relative">
                <img
                  src="/girl image.png"
                  alt="Student with backpack"
                  className="w-10/12 max-w-xs sm:max-w-md md:max-w-lg lg:w-full h-auto mx-auto object-contain animate-float"
                  style={{ marginBottom: '-18rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;