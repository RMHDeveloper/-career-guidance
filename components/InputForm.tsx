import React, { useState } from 'react';
import Box from './common/Box';
import Input from './common/Input';
import Button from './common/Button';
import { BriefcaseIcon, SearchIcon, RocketIcon } from './common/Icons';
import { SavedRoadmap } from '../types';

interface InputFormProps {
  onSubmit: (qualification: string, interests: string, currentSkills: string) => void;
  savedRoadmaps?: SavedRoadmap[];
  onOpenSaved?: (saved: SavedRoadmap) => void;
  onDeleteSaved?: (id: string) => void;
}

const timeAgo = (ts: number): string => {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
};

const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  savedRoadmaps = [],
  onOpenSaved,
  onDeleteSaved,
}) => {
  const [qualification, setQualification] = useState('');
  const [interests, setInterests] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [interestsError, setInterestsError] = useState<string | null>(null);

  // Simple regex to detect URLs. Not exhaustive but covers common cases.
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/i;

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInterests(value);
    if (urlRegex.test(value)) {
      setInterestsError('Raw URLs are not allowed. Please describe your interests in words.');
    } else {
      setInterestsError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Re-validate just before submission to catch any last-minute errors
    if (urlRegex.test(interests)) {
      setInterestsError('Raw URLs are not allowed. Please describe your interests in words.');
      return; // Prevent form submission
    }

    if (!qualification.trim() || !interests.trim()) {
      // Basic check for empty fields, browser's 'required' attribute also handles this
      return;
    }

    if (interestsError) {
      // If there's an error, don't submit
      return;
    }

    onSubmit(qualification, interests, currentSkills);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 gap-6">
      <Box className="w-full max-w-md brutalist-box">
        <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Start Your Journey
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Tell us about yourself to get a personalized roadmap
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <Input
            id="qualification"
            label="Qualification"
            icon={<BriefcaseIcon />}
            placeholder="E.g., B.Com, Digital Creator, Developer"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
          />
          <div>
            <Input
              id="interests"
              label="Interests"
              icon={<SearchIcon />}
              placeholder="E.g., Web Development, AI, Data Analysis"
              value={interests}
              onChange={handleInterestsChange}
              required
              aria-invalid={!!interestsError}
              aria-describedby={interestsError ? "interests-error" : undefined}
            />
            {interestsError && (
              <p id="interests-error" className="text-red-600 font-semibold text-sm mt-2">
                {interestsError}
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="currentSkills" className="text-gray-800 font-semibold mb-2">
              Skills you already have <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="currentSkills"
              rows={2}
              placeholder="E.g., Excel, basic Python, canva, communication"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              className="brutalist-input bg-gray-50 text-black p-4 text-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <p className="text-gray-400 text-xs mt-1">
              Used for a personalized skill-gap analysis.
            </p>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={!!interestsError}>
              BUILD MY ROADMAP
              <RocketIcon className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </Box>

      {savedRoadmaps.length > 0 && (
        <Box className="w-full max-w-md brutalist-box">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">Your saved roadmaps</h2>
          <ul className="flex flex-col gap-2">
            {savedRoadmaps.map((saved) => (
              <li
                key={saved.id}
                className="brutalist-input bg-gray-50 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 p-3"
              >
                <button
                  onClick={() => onOpenSaved?.(saved)}
                  className="flex-1 text-left cursor-pointer"
                >
                  <span className="block font-bold text-blue-700 text-sm">
                    {saved.roadmap.job_title}
                  </span>
                  <span className="block text-gray-500 text-xs mt-0.5">
                    {saved.qualification} &middot; {saved.interests} &middot; {timeAgo(saved.createdAt)}
                  </span>
                </button>
                <button
                  onClick={() => onDeleteSaved?.(saved.id)}
                  aria-label={`Delete saved roadmap for ${saved.roadmap.job_title}`}
                  className="text-gray-400 hover:text-red-600 font-bold text-lg px-2 cursor-pointer shrink-0"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </div>
  );
};

export default InputForm;
