import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import AssessmentModal from "../modals/AssessmentModal";
import ExpertSelectionModal from "../modals/ExpertSelectionModal";

const HeroSection = () => {
  const [displayCount, setDisplayCount] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showExpertSelection, setShowExpertSelection] = useState(false);
  const typingRef = useRef(null);

  // ✨ Define texts declaratively
  const textData = useMemo(
    () => [
      { normal: "Get Personalised 1:1 ", highlight: "Guidance" },
      { normal: "Master New ", highlight: "Skills" },
      { normal: "Innovate and Inspire with ", highlight: "IndieGuru Tribe" },
    ],
    []
  );

  // Plain text for typing logic
  const plainTexts = useMemo(
    () => textData.map((t) => t.normal + t.highlight),
    [textData]
  );

  // Hero images
  const heroImages = useMemo(
    () => ["/hero1.png", "/hero2.png", "/hero3.png"],
    []
  );

  // Typing effect logic
  useEffect(() => {
    setIsVisible(true);
    const currentText = plainTexts[textIndex];

    if (typingRef.current) clearInterval(typingRef.current);

    typingRef.current = setInterval(() => {
      setDisplayCount((prev) => {
        if (!isErasing) {
          // Typing
          if (prev < currentText.length) return prev + 1;
          clearInterval(typingRef.current);
          setTimeout(() => setIsErasing(true), 1500);
          return prev;
        } else {
          // Erasing
          if (prev > 0) return prev - 1;
          clearInterval(typingRef.current);
          setIsErasing(false);
          setTextIndex((prevIndex) => (prevIndex + 1) % plainTexts.length);
          return prev;
        }
      });
    }, isErasing ? 40 : 80);

    return () => clearInterval(typingRef.current);
  }, [isErasing, textIndex, plainTexts]);

  // Image cycling
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(imageInterval);
  }, [heroImages.length]);

  // 🪄 Render partial text dynamically with color
  const renderPartialText = () => {
    const { normal, highlight } = textData[textIndex];
    const fullText = normal + highlight;
    const cut = displayCount;

    if (cut <= normal.length) {
      // typing inside normal part
      return <>{fullText.slice(0, cut)}</>;
    }

    const typedNormal = normal;
    const typedHighlight = highlight.slice(0, cut - normal.length);

    return (
      <>
        {typedNormal}
        <span className="text-blue-900 transition-colors duration-300">
          {typedHighlight}
        </span>
      </>
    );
  };

  return (
    <div className="pt-40 relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: "url(/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Content */}
      <div className="relative h-full w-full flex items-center pt-8 sm:pt-28 lg:pt-0">
        <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div
              className={`space-y-8 mt-[-100px] transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
            >
              {/* Reviews Section */}
              <div className="inline-flex items-center py-2 px-4 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                <div className="flex -space-x-4">
                  {[
                    "https://randomuser.me/api/portraits/men/32.jpg",
                    "https://randomuser.me/api/portraits/women/44.jpg",
                    "https://randomuser.me/api/portraits/men/47.jpg",
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
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
                  <span className="text-gray-800 font-medium text-sm">
                    (10k+ Reviews)
                  </span>
                </div>
              </div>

              {/* Main Heading - Typewriter (no cursor now) */}
              <div className="min-h-24">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="block">{renderPartialText()}</span>
                </h1>
              </div>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-gray-700 max-w-xl">
                Why go without a Guru? Connect with professionals across Tech,
                Design, Finance, Operations, Music, and more.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <button
                  onClick={() => setShowAssessment(true)}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <span>Start My Journey</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setShowExpertSelection(true)}
                  className="border-2 border-blue-700 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  <span>Find My Guru</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div
              className={`relative hidden md:block transition-all duration-1000 delay-500 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="relative h-full flex items-end">
                <div className="absolute -top-12 right-8 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="relative mb-[-200px] w-full h-full flex items-end justify-center">
                  <img
                    key={imageIndex}
                    src={heroImages[imageIndex]}
                    alt={`Hero section ${imageIndex + 1}`}
                    className="object-contain relative z-10 transition-all duration-1000 ease-in-out transform hover:scale-105"
                    style={{
                      height: imageIndex === 2 ? "80vh" : "90vh",
                      maxWidth: "100%",
                      filter:
                        "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssessmentModal
        isOpen={showAssessment}
        onClose={() => setShowAssessment(false)}
      />
      <ExpertSelectionModal
        isOpen={showExpertSelection}
        onClose={() => setShowExpertSelection(false)}
      />
    </div>
  );
};

export default HeroSection;
