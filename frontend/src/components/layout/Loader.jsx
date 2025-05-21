import React from 'react';
import * as Motion from "framer-motion";

const Loader = ({ fullScreen = true, text = "Loading" }) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center bg-gray-50";

  return (
    <Motion.AnimatePresence>
      <Motion.motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={containerClass}
      >
        <Motion.motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Simple spinning loader */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
          
          {/* Only show text if provided */}
          {text && (
            <Motion.motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 text-base font-medium"
            >
              {text}...
            </Motion.motion.p>
          )}
        </Motion.motion.div>
      </Motion.motion.div>
    </Motion.AnimatePresence>
  );
};

export default Loader;
