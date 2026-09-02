export interface ResourceItem {
  title: string;
  link: string;
}

export interface CareerRoadmap {
  job_title: string;
  salary: string;
  qualifications: string[];
  courses: ResourceItem[];
  youtube: ResourceItem[];
  tools: ResourceItem[];
  related_degrees_in_india: string[]; // Added new field
}

export type PageState = 'input' | 'loading' | 'result';

export interface SavedRoadmap {
  id: string;
  qualification: string;
  interests: string;
  currentSkills?: string;
  roadmap: CareerRoadmap;
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// ---- Roadmap insights (second AI pass) ----

export interface TimelinePhase {
  period: string; // e.g. "Months 0-3"
  focus: string; // short title for the phase
  steps: string[]; // concrete action items
}

export type SkillStatus = 'have' | 'partial' | 'gap';

export interface SkillGapItem {
  skill: string;
  status: SkillStatus;
  note: string;
}

export interface DayInLife {
  summary: string;
  typical_tasks: string[];
  pros: string[];
  cons: string[];
  suits_you_if: string[];
  common_reasons_people_leave: string[];
}

export interface JobMarket {
  demand_outlook: string;
  top_hiring_cities: string[];
  typical_employers: string[];
  work_arrangements: string;
  government_exam_routes: string[];
}

export interface RoadmapInsights {
  timeline: TimelinePhase[];
  skill_gap: SkillGapItem[];
  day_in_life: DayInLife;
  reality_check: string;
  job_market: JobMarket;
}

// ---- Resume / LinkedIn kit (on-demand) ----

export interface ResumeKit {
  linkedin_headline: string;
  summary: string;
  bullets: string[];
  skills_to_list: string[];
}
