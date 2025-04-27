import React from 'react';
import * as Motion from "framer-motion";

const Loader = ({ fullScreen = true }) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    : "flex items-center justify-center";

  return (
    <Motion.AnimatePresence>
      <Motion.motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={containerClass}
      >
        <Motion.motion.div 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Spinning ring with gradient and glow effect */}
          <Motion.motion.div 
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Motion.motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 blur-lg opacity-50" 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-16 h-16 rounded-full">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-blue-400 border-r-indigo-400 animate-spin-slow" />
            </div>
          </Motion.motion.div>
          
          {/* Loading text with fade-in animation */}
          <Motion.motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white text-lg font-medium tracking-wide"
          >
            Loading...
          </Motion.motion.p>
        </Motion.motion.div>
      </Motion.motion.div>
    </Motion.AnimatePresence>
  );
};

export default Loader;
