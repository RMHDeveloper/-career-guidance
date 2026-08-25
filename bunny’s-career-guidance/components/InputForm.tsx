import React, { useState } from 'react';
import Box from './common/Box';
import Input from './common/Input';
import Button from './common/Button';

interface InputFormProps {
  onSubmit: (qualification: string, interests: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [qualification, setQualification] = useState('');
  const [interests, setInterests] = useState('');
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

    onSubmit(qualification, interests);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      <Box className="w-full max-w-2xl brutalist-box">
        <h1 className="heading-brutalist text-neon-green text-3xl sm:text-4xl text-center mb-8">
          BUNNY’S CAREER GUIDANCE
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <Input
            id="qualification"
            label="QUALIFICATION"
            placeholder="E.g., B.Com, Digital Creator, Developer"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            required
          />
          <div>
            <Input
              id="interests"
              label="INTERESTS"
              placeholder="E.g., Web Development, AI, Data Analysis"
              value={interests}
              onChange={handleInterestsChange}
              required
              aria-invalid={!!interestsError}
              aria-describedby={interestsError ? "interests-error" : undefined}
            />
            {interestsError && (
              <p id="interests-error" className="text-electric-yellow font-bold uppercase text-sm mt-2">
                {interestsError}
              </p>
            )}
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={!!interestsError}>
              BUILD MY ROADMAP
            </Button>
          </div>
        </form>
      </Box>
    </div>
  );
};

export default InputForm;