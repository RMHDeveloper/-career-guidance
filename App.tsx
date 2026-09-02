import React, { useState, useCallback, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import { PageState, CareerRoadmap, SavedRoadmap } from './types';
import { generateCareerRoadmap } from './services/geminiService';
import { getSavedRoadmaps, saveRoadmap, deleteRoadmap } from './services/storage';
import Button from './components/common/Button'; // Import Button for the new back button

interface LastInput {
  qualification: string;
  interests: string;
  currentSkills: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('input');
  const [roadmapData, setRoadmapData] = useState<CareerRoadmap | null>(null);
  const [lastInput, setLastInput] = useState<LastInput>({
    qualification: '',
    interests: '',
    currentSkills: '',
  });
  const [currentSavedId, setCurrentSavedId] = useState<string | undefined>(undefined);
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);
  const [appErrorMessage, setAppErrorMessage] = useState<string | null>(null);

  const refreshSaved = useCallback(() => setSavedRoadmaps(getSavedRoadmaps()), []);

  const handleGenerateRoadmap = useCallback(
    async (qualification: string, interests: string, currentSkills = '') => {
      setCurrentPage('loading');
      setAiErrorMessage(null);
      setAppErrorMessage(null);
      setRoadmapData(null);
      setCurrentSavedId(undefined);
      setLastInput({ qualification, interests, currentSkills });

      try {
        const result = await generateCareerRoadmap(qualification, interests);
        if (result) {
          setRoadmapData(result);
          const saved = saveRoadmap(qualification, interests, result, currentSkills);
          setCurrentSavedId(saved.id);
          refreshSaved();
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
    },
    [refreshSaved]
  );

  // Load saved roadmaps, and auto-generate if the URL carries a shared roadmap.
  useEffect(() => {
    refreshSaved();
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const i = params.get('i');
    const s = params.get('s') || '';
    if (q && i) {
      handleGenerateRoadmap(q, i, s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenSaved = useCallback((saved: SavedRoadmap) => {
    setRoadmapData(saved.roadmap);
    setLastInput({
      qualification: saved.qualification,
      interests: saved.interests,
      currentSkills: saved.currentSkills || '',
    });
    setCurrentSavedId(saved.id);
    setAiErrorMessage(null);
    setAppErrorMessage(null);
    setCurrentPage('result');
  }, []);

  const handleDeleteSaved = useCallback(
    (id: string) => {
      deleteRoadmap(id);
      refreshSaved();
    },
    [refreshSaved]
  );

  const handleReset = useCallback(() => {
    setRoadmapData(null);
    setCurrentSavedId(undefined);
    setAiErrorMessage(null);
    setAppErrorMessage(null);
    setCurrentPage('input');
    refreshSaved();
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [refreshSaved]);

  return (
    <div className="min-h-screen bg-slate-50 text-black flex flex-col relative"> {/* Added relative for absolute positioning of children */}
      {/* Global Error Message */}
      {appErrorMessage && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-red-800 text-white text-center font-bold uppercase brutalist-box z-50 no-print">
          {appErrorMessage}
        </div>
      )}

      {/* Header: logo (left) + back button (right), in normal flow so they never overlap the page content */}
      {currentPage !== 'loading' && (
        <div className="flex items-center justify-between p-4 no-print">
          <img
            src="https://rabbitmarketinghouse.in/webinar/assets/Untitled%20design%20(5).png"
            alt="Rabbit Marketing House Logo"
            className="w-12 h-12 object-contain"
          />
          {currentPage === 'result' ? (
            <Button onClick={handleReset} variant="secondary" className="text-sm px-4 py-2">
              GO BACK
            </Button>
          ) : (
            <div />
          )}
        </div>
      )}

      <div className="flex-grow flex flex-col">
        {currentPage === 'loading' && <LoadingScreen />}
        {currentPage === 'input' && (
          <InputForm
            onSubmit={handleGenerateRoadmap}
            savedRoadmaps={savedRoadmaps}
            onOpenSaved={handleOpenSaved}
            onDeleteSaved={handleDeleteSaved}
          />
        )}
        {currentPage === 'result' && (
          <ResultDisplay
            roadmap={roadmapData}
            errorMessage={aiErrorMessage}
            onReset={handleReset}
            qualification={lastInput.qualification}
            interests={lastInput.interests}
            currentSkills={lastInput.currentSkills}
            savedId={currentSavedId}
          />
        )}
      </div>
      <footer className="w-full text-center py-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold mt-8 no-print">
        Developed by Rabbit Marketing House
      </footer>
    </div>
  );
};

export default App;
