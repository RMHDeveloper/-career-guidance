import React, { useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { PageState, CareerRoadmap } from './types';
import { generateCareerRoadmap } from './services/geminiService';
import Button from './components/common/Button'; // Import Button for the new back button

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('input');
  const [roadmapData, setRoadmapData] = useState<CareerRoadmap | null>(null);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [appErrorMessage, setAppErrorMessage] = useState<string | null>(null);

  const handleGenerateRoadmap = useCallback(async (qualification: string, interests: string) => {
    setCurrentPage('loading');
    setAiErrorMessage(null);
    setAppErrorMessage(null);
    setRoadmapData(null);
    
    try {
      const result = await generateCareerRoadmap(qualification, interests);
      if (result) {
        setRoadmapData(result);
        setCurrentPage('result');
      } else {
        setAiErrorMessage(
          'The AI could not generate a meaningful roadmap based on your input. Please try rephrasing or providing more details, especially avoiding raw URLs or overly vague interests.'
        );
        setCurrentPage('result');
      }
    } catch (err) {
      console.error('API call failed:', err);
      setAppErrorMessage('An unexpected error occurred. Please check your network and API key.');
      setCurrentPage('input');
    }
  }, []);

  const handleReset = useCallback(() => {
    setRoadmapData(null);
    setAiErrorMessage(null);
    setAppErrorMessage(null);
    setCurrentPage('input');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-black flex flex-col relative"> {/* Added relative for absolute positioning of children */}
      {/* Global Error Message */}
      {appErrorMessage && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-800 text-white text-center font-bold uppercase brutalist-box z-50">
          {appErrorMessage}
        </div>
      )}

      {/* Top-Left Logo */}
      {currentPage !== 'loading' && (
        <div className="absolute top-4 left-4 z-10"> {/* Removed brutalist-box, bg-[#1A1A1A], p-2 */}
          <img 
            src="https://rabbitmarketinghouse.in/webinar/assets/Untitled%20design%20(5).png" 
            alt="Rabbit Marketing House Logo" 
            className="w-12 h-12 object-contain" 
          />
        </div>
      )}

      {/* Top-Right Back Button */}
      {currentPage === 'result' && (
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={handleReset} variant="secondary" className="text-sm px-4 py-2">
            GO BACK
          </Button>
        </div>
      )}

      <div className="flex-grow flex flex-col">
        {currentPage === 'loading' && <LoadingScreen />}
        {currentPage === 'input' && <InputForm onSubmit={handleGenerateRoadmap} />}
        {currentPage === 'result' && (
          <ResultDisplay roadmap={roadmapData} errorMessage={aiErrorMessage} onReset={handleReset} />
        )}
      </div>
      <footer className="w-full text-center py-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold mt-8">
        Developed by Rabbit Marketing House
      </footer>
    </div>
  );
};

export default App;