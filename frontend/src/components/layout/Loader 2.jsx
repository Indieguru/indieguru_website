import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="flex flex-col items-center gap-4">
        {/* Smooth spinning gradient ring */}
        <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin shadow-md"></div>
        
        {/* Elegant loading text */}
        <p className="text-white text-lg font-semibold tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
