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