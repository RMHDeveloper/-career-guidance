import { CareerRoadmap, ChatMessage, RoadmapInsights, ResumeKit } from "../types";

export const generateCareerRoadmap = async (
  qualification: string,
  interests: string
): Promise<CareerRoadmap | null> => {
  try {
    const response = await fetch("/api/generate-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qualification, interests }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Roadmap API Error:", errorText);
      throw new Error(`Roadmap request failed with status ${response.status}`);
    }

    const roadmap = (await response.json()) as CareerRoadmap;
    return roadmap;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    return null;
  }
};

export const askFollowUp = async (
  roadmap: CareerRoadmap,
  question: string,
  history: ChatMessage[]
): Promise<string> => {
  const response = await fetch("/api/ask-followup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roadmap, question, history }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Follow-up API Error:", errorText);
    throw new Error(`Follow-up request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { answer: string };
  return data.answer;
};

interface InsightsInput {
  qualification: string;
  interests: string;
  currentSkills?: string;
  jobTitle?: string;
}

export const getRoadmapInsights = async (input: InsightsInput): Promise<RoadmapInsights> => {
  const response = await fetch("/api/roadmap-insights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Insights API Error:", errorText);
    throw new Error(`Insights request failed with status ${response.status}`);
  }

  return (await response.json()) as RoadmapInsights;
};

interface ResumeInput {
  jobTitle: string;
  qualification: string;
  interests: string;
  currentSkills?: string;
  experience: string;
}

export const getResumeKit = async (input: ResumeInput): Promise<ResumeKit> => {
  const response = await fetch("/api/resume-bullets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Resume API Error:", errorText);
    throw new Error(`Resume request failed with status ${response.status}`);
  }

  return (await response.json()) as ResumeKit;
};
