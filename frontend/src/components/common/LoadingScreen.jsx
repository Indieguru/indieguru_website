import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-12">
        {/* Logo and brand name transition container */}
        <div className="relative w-96 h-32 flex items-center justify-center">
          {/* Logo only - fades out */}
          <div className="absolute inset-0 flex items-center justify-center animate-logo-fade">
            <img 
              src="/logo.svg" 
              alt="IndieGuru Logo" 
              className="h-24 w-auto" 
            />
          </div>
          
          {/* Logo with brand name - fades in */}
          <div className="absolute inset-0 flex items-center justify-center animate-brand-fade">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.svg" 
                alt="IndieGuru Logo" 
                className="h-16 w-auto" 
              />
              <h1 className="text-4xl font-bold text-indigo-900 tracking-tight">
                IndieGuru
              </h1>
            </div>
          </div>
        </div>
        
        {/* Loading dots */}
        <div className="flex items-center gap-3">
          <div 
            className="w-3 h-3 bg-indigo-900 rounded-full" 
            style={{ 
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '0ms'
            }}
          ></div>
          <div 
            className="w-3 h-3 bg-indigo-900 rounded-full" 
            style={{ 
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '200ms'
            }}
          ></div>
          <div 
            className="w-3 h-3 bg-indigo-900 rounded-full" 
            style={{ 
              animation: 'bounce 1.4s infinite ease-in-out',
              animationDelay: '400ms'
            }}
          ></div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style>{`
        @keyframes logo-fade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        @keyframes brand-fade {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          50% {
            opacity: 0;
            transform: scale(0.95);
          }
          60% {
            opacity: 1;
            transform: scale(1);
          }
          90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        .animate-logo-fade {
          animation: logo-fade 4s ease-in-out infinite;
        }
        
        .animate-brand-fade {
          animation: brand-fade 4s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
