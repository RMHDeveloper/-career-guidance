import React, { useState, useEffect } from 'react';
import Box from './common/Box';
// import SpinningIcon from './common/SpinningIcon'; // Removed as it's no longer used

const loadingMessages = [
  "IDENTIFYING YOUR STRENGTHS...",
  "SCANNING THE JOB MARKET...",
  "MAPPING YOUR FUTURE...",
];

const LoadingScreen: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        (prevIndex + 1) % loadingMessages.length
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <Box className="flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 text-center w-full max-w-lg brutalist-box">
        {/* Replaced SpinningIcon with the actual logo image */}
        <img
          src="https://rabbitmarketinghouse.in/webinar/assets/Untitled%20design%20(5).png"
          alt="Rabbit Marketing House Logo"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
        />
        <h1 className="heading-brutalist text-neon-green text-2xl sm:text-3xl md:text-4xl mt-8 mb-8 flex items-center justify-center min-h-[5rem]">
          {loadingMessages[currentMessageIndex]}
        </h1>
        <div className="mt-8">
          <p className="heading-brutalist text-electric-yellow text-4xl sm:text-5xl">
            BUNNY'S
          </p>
          <p className="heading-brutalist text-white text-lg sm:text-xl -mt-2">
            CAREER GUIDANCE
          </p>
        </div>
      </Box>
    </div>
  );
};

export default LoadingScreen;