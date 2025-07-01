import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const steps = [
    {
      number: 1,
      title: "Start your Journey",
      description: "Share your interests or pick an industry to match with the right Guru"
    },
    {
      number: 2,
      title: "Choose your Guru",
      description: "Based on your inputs, choose from professionals across industries — designers, data pros, chefs, coders & more"
    },
    {
      number: 3,
      title: "Get Personalised 1:1 guidance",
      description: "Schedule a one-on-one call with your Guru to get tailored guidance at a time that suits you"
    },
    {
      number: 4,
      title: "Master Skills and Collaborate Smarter",
      description: "Access curated courses and join a tribe of learners, creators, and mentors"
    }
  ];

  useEffect(() => {
    const sectionRefCurrent = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRefCurrent) {
      observer.observe(sectionRefCurrent);
    }

    return () => {
      if (sectionRefCurrent) {
        observer.unobserve(sectionRefCurrent);
      }
    };
  }, []);

  const handleStepChange = (step) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const currentStepData = steps[currentStep - 1];

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const stepVariants = {
    active: { scale: 1.25, backgroundColor: '#003265', borderColor: 'rgba(0, 50, 101, 0.2)' },
    completed: { scale: 1.25, backgroundColor: '#003265', borderColor: 'rgba(0, 50, 101, 0.2)' },
    inactive: { scale: 1, backgroundColor: '#E5E7EB', borderColor: 'transparent' }
  };

  return (
    <div ref={sectionRef} className="max-w-[100vw] pb-40 relative min-h-screen py-12 overflow-hidden bg-gradient-to-b from-white to-blue-50/30">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes oscillate {
          0% { transform: translateX(0) rotate(0); }
          50% { transform: translateX(10px) rotate(2deg); }
          100% { transform: translateX(0) rotate(0); }
        }
        .animate-oscillate {
          animation: oscillate 4s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}} />

      {/* Floating Vectors with Circles */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:block absolute top-32 left-10"
      >
        <div className="relative w-40 h-40 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-100/80 rounded-full"
          />
          <img 
            src="/im-1.png" 
            alt="Book vector" 
            className="w-32 animate-oscillate relative z-10 hover:scale-110 transition-transform duration-300"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={isVisible ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute hidden md:block top-32 right-10"
      >
        <div className="relative w-40 h-40 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-100/50 rounded-full"
          />
          <img 
            src="/im-2.png" 
            alt="Trophy vector" 
            className="w-32 animate-oscillate relative z-10 hover:scale-110 transition-transform duration-300"
          />
        </div>
      </motion.div>

      <motion.img 
        initial={{ y: 100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        src="/im-4.png" 
        alt="People vector" 
        className="absolute hidden md:block -bottom-14 left-10 w-64"
      />

      <motion.img 
        initial={{ y: 100, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        src="/im-5.png" 
        alt="Smile vector" 
        className="hidden md:block absolute bottom-10 right-10 w-32 animate-oscillate"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ y: 30, opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-bold text-center mb-16 mt-20"
        >
          How IndieGuru works?
          <motion.span 
            initial={{ width: 0 }}
            animate={isVisible ? { width: "8rem" } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="block h-1 bg-primary mx-auto mt-4"
          />
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Desktop Preview */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="sticky top-24 hover:scale-105 transition-transform duration-500">
              <img 
                src="/Desktop.png"
                alt="Desktop preview"
                className="w-full rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
          </motion.div>

          {/* Center - Step Path */}
          <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center sticky top-24 h-[calc(80vh-12rem)]">
            <div className="relative h-full w-0.5 bg-gray-200">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial="inactive"
                  animate={
                    currentStep === step.number
                      ? "active"
                      : currentStep > step.number
                      ? "completed"
                      : "inactive"
                  }
                  variants={stepVariants}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleStepChange(step.number)}
                  style={{
                    top: `${(index * 100) / (steps.length - 1)}%`
                  }}
                  className="absolute w-4 h-4 rounded-full -left-1.5 transform -translate-y-1/2 cursor-pointer border-4
                    hover:scale-125 transition-all duration-300 ease-out"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
              <motion.div
                className="absolute w-0.5 bg-primary"
                initial={{ height: "0%" }}
                animate={{ 
                  height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Right Side - Current Step */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepData.number}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-6"
                >
                  <motion.div 
                    className="flex-shrink-0"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <img 
                      src="/im-3.png" 
                      alt="Step icon" 
                      className="w-10 animate-float"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-3">{currentStepData.title}</h3>
                    <p className="text-gray-600 text-lg mb-8">{currentStepData.description}</p>
                    
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStepChange(currentStep - 1)}
                        className={`flex items-center gap-1 border-none bg-transparent focus:outline-none transition-colors duration-300 ${
                          currentStep > 1
                            ? 'text-primary hover:text-blue-700'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={currentStep <= 1}
                      >
                        ←
                        <span>Previous</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStepChange(currentStep + 1)}
                        className={`flex items-center gap-1 border-none bg-transparent focus:outline-none transition-colors duration-300 ${
                          currentStep < steps.length
                            ? 'text-primary hover:text-blue-700'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={currentStep >= steps.length}
                      >
                        <span>Next</span>
                        →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;