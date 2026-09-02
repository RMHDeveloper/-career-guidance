import React, { useState } from 'react';
import Box from './common/Box';
import { CareerRoadmap, ResumeKit as ResumeKitData } from '../types';
import { getResumeKit } from '../services/geminiService';

interface ResumeKitProps {
  roadmap: CareerRoadmap;
  qualification: string;
  interests: string;
  currentSkills?: string;
}

const CopyButton: React.FC<{ text: string; label?: string }> = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          window.prompt('Copy:', text);
        }
      }}
      className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase cursor-pointer shrink-0"
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

const ResumeKit: React.FC<ResumeKitProps> = ({
  roadmap,
  qualification,
  interests,
  currentSkills,
}) => {
  const [open, setOpen] = useState(false);
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kit, setKit] = useState<ResumeKitData | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getResumeKit({
        jobTitle: roadmap.job_title,
        qualification,
        interests,
        currentSkills,
        experience,
      });
      setKit(result);
    } catch (err) {
      console.error(err);
      setError('Could not generate resume content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const allBulletsText = kit
    ? [
        `LinkedIn headline: ${kit.linkedin_headline}`,
        '',
        `Summary: ${kit.summary}`,
        '',
        'Resume bullets:',
        ...kit.bullets.map((b) => `- ${b}`),
        '',
        `Skills: ${kit.skills_to_list.join(', ')}`,
      ].join('\n')
    : '';

  return (
    <Box className="brutalist-box no-print">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="heading-brutalist text-electric-yellow text-2xl sm:text-3xl">
            RESUME &amp; LINKEDIN KIT
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Generate resume bullets and a LinkedIn headline for {roadmap.job_title}.
          </p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="brutalist-button bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 cursor-pointer transition-colors shrink-0"
        >
          {open ? 'HIDE' : 'OPEN'}
        </button>
      </div>

      {open && (
        <div className="mt-5">
          <label htmlFor="resume-experience" className="block font-semibold text-gray-800 mb-2">
            What have you actually done? (projects, internships, jobs, coursework, achievements)
          </label>
          <textarea
            id="resume-experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            rows={4}
            placeholder="E.g. Built a personal expense-tracker web app with React. Interned 2 months at a local agency helping run Instagram ads. Led my college fest social media."
            className="brutalist-input bg-gray-50 text-black p-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-400 text-xs mt-1">
            Optional, but the more you add the more specific the bullets.
          </p>

          <button
            onClick={generate}
            disabled={loading}
            className="brutalist-button bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'WRITING…' : kit ? 'REGENERATE' : 'GENERATE'}
          </button>

          {error && <p className="text-red-600 font-semibold text-sm mt-3">{error}</p>}

          {kit && (
            <div className="mt-6 flex flex-col gap-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-blue-700">LinkedIn headline</h3>
                  <CopyButton text={kit.linkedin_headline} />
                </div>
                <p className="text-black bg-gray-50 rounded-xl p-3">{kit.linkedin_headline}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-blue-700">Professional summary</h3>
                  <CopyButton text={kit.summary} />
                </div>
                <p className="text-black bg-gray-50 rounded-xl p-3">{kit.summary}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-blue-700">Resume bullets</h3>
                  <CopyButton text={kit.bullets.map((b) => `• ${b}`).join('\n')} />
                </div>
                <ul className="list-disc list-inside text-black bg-gray-50 rounded-xl p-3 space-y-1.5">
                  {kit.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-blue-700">Skills to list</h3>
                  <CopyButton text={kit.skills_to_list.join(', ')} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {kit.skills_to_list.map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-1">
                <CopyButton text={allBulletsText} label="Copy everything" />
              </div>
            </div>
          )}
        </div>
      )}
    </Box>
  );
};

export default ResumeKit;
