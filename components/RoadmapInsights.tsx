import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from './common/Box';
import {
  CareerRoadmap,
  RoadmapInsights as RoadmapInsightsData,
  SkillStatus,
  TimelinePhase,
} from '../types';
import { getRoadmapInsights } from '../services/geminiService';
import { buildJobSearchLinks } from '../services/jobLinks';
import { getTimelineProgress, setTimelineProgress } from '../services/storage';

interface RoadmapInsightsProps {
  roadmap: CareerRoadmap;
  qualification: string;
  interests: string;
  currentSkills?: string;
  savedId?: string;
}

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="heading-brutalist text-electric-yellow text-2xl sm:text-3xl mb-4">{children}</h2>
);

const Bullets: React.FC<{ items?: string[]; className?: string }> = ({ items, className }) =>
  items && items.length > 0 ? (
    <ul className={`list-disc list-inside text-base sm:text-lg text-black space-y-1.5 ${className || ''}`}>
      {items.map((it, i) => (
        <li key={i} className="pl-1">
          {it}
        </li>
      ))}
    </ul>
  ) : null;

// ---- Timeline ----

const TimelineSection: React.FC<{ phases: TimelinePhase[]; savedId?: string }> = ({
  phases,
  savedId,
}) => {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProgress(getTimelineProgress(savedId || ''));
  }, [savedId]);

  const total = useMemo(
    () => phases.reduce((n, p) => n + (p.steps?.length || 0), 0),
    [phases]
  );
  const done = useMemo(
    () => Object.values(progress).filter(Boolean).length,
    [progress]
  );

  const toggle = useCallback(
    (key: string) => {
      setProgress((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        if (savedId) setTimelineProgress(savedId, next);
        return next;
      });
    },
    [savedId]
  );

  if (!phases || phases.length === 0) return null;

  return (
    <Box className="brutalist-box">
      <SectionHeading>YOUR STEP-BY-STEP TIMELINE</SectionHeading>
      {total > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {done} / {total} steps
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <ol className="relative border-l-2 border-blue-200 ml-2 space-y-6">
        {phases.map((phase, pi) => (
          <li key={pi} className="ml-5">
            <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
            <p className="text-blue-700 font-extrabold text-sm uppercase tracking-wide">
              {phase.period}
            </p>
            <p className="font-bold text-lg text-black mb-2">{phase.focus}</p>
            <ul className="space-y-1.5">
              {(phase.steps || []).map((step, si) => {
                const key = `${pi}-${si}`;
                return (
                  <li key={si}>
                    <label className="flex items-start gap-2 cursor-pointer text-black">
                      <input
                        type="checkbox"
                        checked={!!progress[key]}
                        onChange={() => toggle(key)}
                        className="mt-1 w-4 h-4 accent-blue-600 shrink-0"
                      />
                      <span className={progress[key] ? 'line-through text-gray-400' : ''}>
                        {step}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      {!savedId && (
        <p className="text-gray-400 text-xs mt-4">
          Tip: open this roadmap from &ldquo;Your saved roadmaps&rdquo; to keep your progress.
        </p>
      )}
    </Box>
  );
};

// ---- Skill gap ----

const STATUS_STYLES: Record<SkillStatus, { label: string; cls: string }> = {
  have: { label: 'You have this', cls: 'bg-green-100 text-green-800' },
  partial: { label: 'Partial', cls: 'bg-yellow-100 text-yellow-800' },
  gap: { label: 'Gap', cls: 'bg-red-100 text-red-700' },
};

const SkillGapSection: React.FC<{ items: RoadmapInsightsData['skill_gap'] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <Box className="brutalist-box">
      <SectionHeading>SKILL-GAP ANALYSIS</SectionHeading>
      <div className="flex flex-col divide-y divide-gray-100">
        {items.map((item, i) => {
          const style = STATUS_STYLES[item.status] || STATUS_STYLES.gap;
          return (
            <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
              <div className="sm:w-56 shrink-0 flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${style.cls}`}
                >
                  {style.label}
                </span>
                <span className="font-bold text-black">{item.skill}</span>
              </div>
              <p className="text-gray-700 text-base flex-1">{item.note}</p>
            </div>
          );
        })}
      </div>
    </Box>
  );
};

// ---- Day in the life + reality check ----

const DayInLifeSection: React.FC<{
  day: RoadmapInsightsData['day_in_life'];
  realityCheck: string;
}> = ({ day, realityCheck }) => {
  if (!day && !realityCheck) return null;
  return (
    <Box className="brutalist-box">
      <SectionHeading>A DAY IN THE LIFE</SectionHeading>
      {day?.summary && <p className="text-black text-base sm:text-lg mb-5">{day.summary}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {day?.typical_tasks?.length ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">Typical tasks</h3>
            <Bullets items={day.typical_tasks} />
          </div>
        ) : null}
        {day?.suits_you_if?.length ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">This suits you if&hellip;</h3>
            <Bullets items={day.suits_you_if} />
          </div>
        ) : null}
        {day?.pros?.length ? (
          <div>
            <h3 className="font-extrabold text-green-700 mb-1">Pros</h3>
            <Bullets items={day.pros} />
          </div>
        ) : null}
        {day?.cons?.length ? (
          <div>
            <h3 className="font-extrabold text-red-600 mb-1">Cons</h3>
            <Bullets items={day.cons} />
          </div>
        ) : null}
        {day?.common_reasons_people_leave?.length ? (
          <div className="sm:col-span-2">
            <h3 className="font-extrabold text-red-600 mb-1">Why some people leave this field</h3>
            <Bullets items={day.common_reasons_people_leave} />
          </div>
        ) : null}
      </div>

      {realityCheck && (
        <div className="mt-6 border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-xl">
          <h3 className="font-extrabold text-yellow-800 mb-1">Reality check</h3>
          <p className="text-black text-base">{realityCheck}</p>
        </div>
      )}
    </Box>
  );
};

// ---- India job market ----

const JobMarketSection: React.FC<{
  market: RoadmapInsightsData['job_market'];
  jobTitle: string;
}> = ({ market, jobTitle }) => {
  const links = useMemo(() => buildJobSearchLinks(jobTitle), [jobTitle]);
  if (!market) return null;
  return (
    <Box className="brutalist-box">
      <SectionHeading>INDIA JOB MARKET</SectionHeading>
      {market.demand_outlook && (
        <p className="text-black text-base sm:text-lg mb-5">{market.demand_outlook}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
        {market.top_hiring_cities?.length ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">Top hiring cities</h3>
            <p className="text-black text-base">{market.top_hiring_cities.join(', ')}</p>
          </div>
        ) : null}
        {market.typical_employers?.length ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">Typical employers</h3>
            <Bullets items={market.typical_employers} />
          </div>
        ) : null}
        {market.work_arrangements ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">Work arrangements</h3>
            <p className="text-black text-base">{market.work_arrangements}</p>
          </div>
        ) : null}
        {market.government_exam_routes?.length ? (
          <div>
            <h3 className="font-extrabold text-blue-700 mb-1">Government / PSU routes</h3>
            <Bullets items={market.government_exam_routes} />
          </div>
        ) : null}
      </div>

      {links.length > 0 && (
        <div className="mt-6">
          <h3 className="font-extrabold text-blue-700 mb-2">
            Search live openings for &ldquo;{jobTitle}&rdquo;
          </h3>
          <div className="flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.title}
                href={l.link}
                target="_blank"
                rel="noopener noreferrer"
                className="brutalist-button bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 transition-colors"
              >
                {l.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
};

// ---- Orchestrator ----

const RoadmapInsights: React.FC<RoadmapInsightsProps> = ({
  roadmap,
  qualification,
  interests,
  currentSkills,
  savedId,
}) => {
  const [data, setData] = useState<RoadmapInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setData(null);

    getRoadmapInsights({
      qualification,
      interests,
      currentSkills,
      jobTitle: roadmap.job_title,
    })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [qualification, interests, currentSkills, roadmap.job_title, attempt]);

  if (loading) {
    return (
      <Box className="brutalist-box text-center">
        <p className="heading-brutalist text-neon-green text-lg sm:text-xl animate-pulse">
          ANALYZING THE ROLE, YOUR SKILL GAP, TIMELINE &amp; JOB MARKET&hellip;
        </p>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box className="brutalist-box text-center no-print">
        <p className="text-black text-base mb-3">
          Could not load the deep-dive analysis this time.
        </p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="brutalist-button bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 cursor-pointer transition-colors"
        >
          RETRY
        </button>
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <DayInLifeSection day={data.day_in_life} realityCheck={data.reality_check} />
      <SkillGapSection items={data.skill_gap} />
      <TimelineSection phases={data.timeline} savedId={savedId} />
      <JobMarketSection market={data.job_market} jobTitle={roadmap.job_title} />
    </div>
  );
};

export default RoadmapInsights;
