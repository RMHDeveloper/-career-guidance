import React from 'react';
import Box from './common/Box';
import Button from './common/Button';
import { CareerRoadmap, ResourceItem } from '../types';

interface ResultDisplayProps {
  roadmap: CareerRoadmap | null;
  errorMessage?: string | null;
  onReset: () => void;
}

const ResourceCard: React.FC<{ item: ResourceItem }> = ({ item }) => {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="brutalist-box bg-[#1A1A1A] p-4 text-neon-green text-lg font-bold uppercase block brutalist-box hover:bg-[#2e2e2e] transition-colors duration-75 text-center"
      aria-label={`Link to ${item.title}`}
    >
      {item.title}
    </a>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ roadmap, errorMessage, onReset }) => {
  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center">
      {roadmap ? (
        <div className="w-full max-w-4xl mt-8">
          {/* Removed the top Disclaimer Box as per user request */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Box 1: The Profile */}
            <Box className="flex flex-col brutalist-box">
              <h2 className="heading-brutalist text-electric-yellow text-2xl sm:text-3xl mb-4">
                THE PROFILE
              </h2>
              <p className="text-neon-green text-xl sm:text-2xl font-bold uppercase mb-2">
                {roadmap.job_title}
              </p>
              <div className="bg-electric-yellow text-black font-bold uppercase px-4 py-2 inline-block brutalist-box w-fit text-sm sm:text-base mb-6">
                AVG. SALARY: INR {roadmap.salary}
              </div>

              <h3 className="heading-brutalist text-neon-green text-xl sm:text-2xl mt-4 mb-3">
                REQUIRED QUALIFICATIONS:
              </h3>
              {roadmap.qualifications && roadmap.qualifications.length > 0 ? (
                <ul className="list-disc list-inside text-lg text-white space-y-2">
                  {roadmap.qualifications.map((qualification, index) => (
                    <li key={index} className="pl-2">
                      <span className="text-white">{qualification}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white text-base italic">No qualifications suggested.</p>
              )}

              <h3 className="heading-brutalist text-neon-green text-xl sm:text-2xl mt-6 mb-3">
                RELATED DEGREES IN INDIA:
              </h3>
              {roadmap.related_degrees_in_india && roadmap.related_degrees_in_india.length > 0 ? (
                <ul className="list-disc list-inside text-lg text-white space-y-2">
                  {roadmap.related_degrees_in_india.map((degree, index) => (
                    <li key={index} className="pl-2">
                      <span className="text-white">{degree}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white text-base italic">No related degrees suggested.</p>
              )}

              <h3 className="heading-brutalist text-neon-green text-xl sm:text-2xl mt-6 mb-3">
                ESSENTIAL TOOLS:
              </h3>
              {roadmap.tools && roadmap.tools.length > 0 ? (
                <ul className="list-disc list-inside text-lg text-white space-y-2">
                  {roadmap.tools.map((tool, index) => (
                    <li key={index} className="pl-2">
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                      >
                        {tool.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white text-base italic">No tools suggested.</p>
              )}
            </Box>

            {/* Box 2: The Resource Vault */}
            <Box className="flex flex-col brutalist-box">
              <h2 className="heading-brutalist text-electric-yellow text-2xl sm:text-3xl mb-4">
                THE RESOURCE VAULT
              </h2>

              <h3 className="heading-brutalist text-neon-green text-xl sm:text-2xl mt-4 mb-3">
                VERIFIED ONLINE COURSES:
              </h3>
              {roadmap.courses && roadmap.courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roadmap.courses.map((course, index) => (
                    <ResourceCard key={index} item={course} />
                  ))}
                </div>
              ) : (
                <p className="text-white text-base italic">No verified courses found.</p>
              )}

              <h3 className="heading-brutalist text-neon-green text-xl sm:text-2xl mt-6 mb-3">
                YOUTUBE CHANNELS:
              </h3>
              {roadmap.youtube && roadmap.youtube.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roadmap.youtube.map((yt, index) => (
                    <ResourceCard key={index} item={yt} />
                  ))}
                </div>
              ) : (
                <p className="text-white text-base italic">No YouTube channels found.</p>
              )}
            </Box>
          </div>

          {/* This Disclaimer and "START NEW" button will remain */}
          <Box className="text-center mt-8 brutalist-box">
            <p className="heading-brutalist text-electric-yellow text-base sm:text-lg mb-4">
              AI-GENERATED SUGGESTIONS. VERIFY ALL INFORMATION BEFORE MAKING CAREER DECISIONS.
            </p>
            <Button onClick={onReset} variant="primary" className="w-full sm:w-auto">
              START NEW
            </Button>
          </Box>
        </div>
      ) : (
        <Box className="w-full max-w-4xl text-center brutalist-box p-8 mt-8">
          <p className="heading-brutalist text-neon-green text-xl sm:text-2xl mb-4">
            ERROR:
          </p>
          <p className="text-white text-lg sm:text-xl mb-6">
            {errorMessage || 'An unknown error occurred. Please try again.'}
          </p>
          <p className="text-electric-yellow text-base sm:text-lg">
            Consider refining your input.
          </p>
          <Button onClick={onReset} variant="primary" className="w-full sm:w-auto mt-8">
            TRY AGAIN
          </Button>
        </Box>
      )}
    </div>
  );
};

export default ResultDisplay;