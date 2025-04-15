import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const HeroSection = () => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const typingRef = useRef(null);
  const eraseRef = useRef(null);

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

  // Improved typewriter effect with better timing control
  useEffect(() => {
    setIsVisible(true);
    
    // Clear any existing intervals when component mounts or dependencies change
    if (typingRef.current) clearInterval(typingRef.current);
    if (eraseRef.current) clearTimeout(eraseRef.current);
    
    const currentText = texts[textIndex];
    
    const typeText = () => {
      setDisplayText(prev => {
        if (prev.length < currentText.length) {
          return currentText.substring(0, prev.length + 1);
        } else {
          // Stop the typing interval once text is complete
          if (typingRef.current) clearInterval(typingRef.current);
          
          // Set a timeout to start erasing after text is displayed for a while
          eraseRef.current = setTimeout(() => {
            eraseText();
          }, 2000);
          
          return prev;
        }
      });
    };
    
    const eraseText = () => {
      // Clear erasing timeout if it exists
      if (eraseRef.current) clearTimeout(eraseRef.current);
      
      const eraseInterval = setInterval(() => {
        setDisplayText(prev => {
          if (prev.length > 0) {
            return prev.substring(0, prev.length - 1);
          } else {
            // When done erasing, move to next text
            clearInterval(eraseInterval);
            setTextIndex(prev => (prev + 1) % texts.length);
            return '';
          }
        });
      }, 50); // Slightly faster erasing for better effect
      
      return () => clearInterval(eraseInterval);
    };
    
    // Start typing effect
    typingRef.current = setInterval(typeText, 100);
    
    // Cleanup function
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (eraseRef.current) clearTimeout(eraseRef.current);
    };
  }, [textIndex, texts]);

  return (
    <div className="pt-40 relative h-screen w-full overflow-hidden">
      {/* Background with overlay gradient */}
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
      >
        <div className="absolute inset-0"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full w-full flex items-center pt-24 sm:pt-28 lg:pt-0">
        <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div
              className={`space-y-8 mt-[-100px] transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              {/* Reviews Section - Improved design */}
              <div className="inline-flex items-center py-2 px-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
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
                <div className="flex flex-col ml-4">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-800 font-medium text-sm">(10k+ Reviews)</span>
                </div>
              </div>

              {/* Main Heading - With typewriter effect */}
              <div className="min-h-24">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">{displayText}</span>
                  <span className="text-blue-700 block mt-1">IndieGuru</span>
                </h1>
              </div>

              {/* Subheading - Improved styling */}
              <p className="text-lg sm:text-xl text-gray-700 max-w-xl">
                Join thousands of learners who have transformed their careers with personalized mentoring
                and expert guidance.
              </p>

              {/* CTA Buttons - Enhanced design */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <Link
                  to="/appointment"
                  className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg text-sm font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <span>Take An Assessment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/experts"
                  className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg text-sm font-semibold text-center transition-all duration-300 flex items-center justify-center"
                >
                  <span>Choose Your Expert</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Trust badges */}
              {/* <div className="pt-8 border-t border-gray-200 mt-8">
                <p className="text-gray-500 text-sm mb-4">Trusted by leading companies</p>
                <div className="flex flex-wrap items-center gap-6">
                  {['Google', 'Microsoft', 'Adobe', 'Amazon'].map((company) => (
                    <div key={company} className="text-gray-400 font-semibold">
                      {company}
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Right Column - Image with improved positioning */}
            <div
              className={`relative transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <div className="relative">
                {/* Abstract shape for visual interest */}
                <div className="absolute -top-12 right-8 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                
                {/* Main image */}
                <img
                  src="/girl image.png"
                  alt="Student learning"
                  className="w-full max-w-lg mx-auto object-contain relative z-10"
                />
                
                {/* Decorative elements */}
                {/* <div className="absolute -bottom-4 -left-4 bg-blue-100 w-24 h-24 rounded-full"></div>
                <div className="absolute top-1/4 right-0 bg-amber-100 w-16 h-16 rounded-full"></div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;