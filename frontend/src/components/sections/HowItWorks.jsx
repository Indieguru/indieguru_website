import { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: "Step 1",
      description: "Revolutionizing mentoring and learning. Revolutionizing mentoring and learning.bdisb Revolutionizing mentoring and learning"
    },
    {
      number: 2,
      title: "Step 2",
      description: "Connect with expert mentors who guide you through your learning journey"
    },
    {
      number: 3,
      title: "Step 3",
      description: "Practice with real-world projects and get personalized feedback"
    },
    {
      number: 4,
      title: "Step 4",
      description: "Track your progress and earn certificates as you grow"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleStepChange = (step) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div ref={sectionRef} className="max-w-[100vw] pb-40 relative min-h-screen py-12 overflow-hidden">
      <style jsx>{`
        @keyframes oscillate {
          0% { transform: translateX(0); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .animate-oscillate {
          animation: oscillate 3s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Vectors with Circles */}
      <div className={`hidden md:block absolute top-32 left-10 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-100/80 rounded-full"></div>
          <img 
            src="/im-1.png" 
            alt="Book vector" 
            className="w-32 animate-oscillate relative z-10"
          />
        </div>
      </div>
      <div className={`absolute hidden md:block top-32 right-10 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-100/50 rounded-full"></div>
          <img 
            src="/im-2.png" 
            alt="Trophy vector" 
            className="w-32 animate-oscillate relative z-10"
          />
        </div>
      </div>
      <img 
        src="/im-4.png" 
        alt="People vector" 
        className={`absolute hidden md:block -bottom-14 left-10 w-64 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      />
      <img 
        src="/im-5.png" 
        alt="Smile vector" 
        className={`hidden md:block absolute bottom-10 right-10 w-32 animate-oscillate transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold text-center mb-16 mt-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          How IndieGuru works?
          <span className="block w-32 h-1 bg-primary mx-auto mt-4"></span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Desktop Preview */}
          <div className={`lg:col-span-5 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="sticky top-24">
              <img 
                src={`/Desktop.png`}
                alt="Desktop preview"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Center - Step Path */}
          <div className={`lg:col-span-2 hidden lg:flex flex-col items-center justify-center sticky top-24 h-[calc(80vh-12rem)] transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            <div className="relative h-full w-0.5 bg-gray-200">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  onClick={() => handleStepChange(step.number)}
                  style={{
                    top: `${(index * 100) / (steps.length - 1)}%`
                  }}
                  className={`absolute w-4 h-4 rounded-full -left-1.5 transition-all duration-300 transform -translate-y-1/2 cursor-pointer ${
                    currentStep === step.number
                      ? 'bg-black border-4 border-black/20 scale-125'
                      : currentStep > step.number
                      ? 'bg-primary border-4 border-primary/20 scale-125'
                      : 'bg-gray-200 scale-100'
                  }`}
                />
              ))}
              <div
                className="absolute w-0.5 bg-primary transition-all duration-300"
                style={{
                  height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Right Side - Current Step */}
          <div className={`lg:col-span-5 transition-all duration-1000 delay-700 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="sticky top-24">
              <div 
                key={currentStepData.number}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0">
                  <img 
                    src="/im-3.png" 
                    alt="Step icon" 
                    className="w-10"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-3">{currentStepData.title}</h3>
                  <p className="text-gray-600 text-lg mb-8">{currentStepData.description}</p>
                  
                  {/* Navigation Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleStepChange(currentStep - 1)}
                      className={`flex items-center gap-1 border-none bg-transparent focus:outline-none ${
                        currentStep > 1
                          ? 'text-primary'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={currentStep <= 1}
                    >
                      ←
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => handleStepChange(currentStep + 1)}
                      className={`flex items-center gap-1 border-none bg-transparent focus:outline-none ${
                        currentStep < steps.length
                          ? 'text-primary'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={currentStep >= steps.length}
                    >
                      <span>Next</span>
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;