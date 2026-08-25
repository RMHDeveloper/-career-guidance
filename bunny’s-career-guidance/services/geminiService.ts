import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CareerRoadmap } from "../types";

// Helper function for robust JSON parsing
const parseJsonSafely = <T,>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Raw JSON string:", jsonString);
    return null;
  }
};

export const generateCareerRoadmap = async (
  qualification: string,
  interests: string,
): Promise<CareerRoadmap | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in the environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on a user's qualification and interests, suggest a job title, average salary in Indian Rupees (INR), required qualifications, relevant resources (3 online courses available in India, 3 YouTube channels, 3 tools).
  Additionally, list 3 related degrees available in India to study.
  
  Qualification: ${qualification}
  Interests: ${interests}
  
  Format the output strictly as a JSON object matching the following schema:
  {
    "job_title": "string",
    "salary": "string",
    "qualifications": ["string"],
    "courses": [{"title": "string", "link": "string"}],
    "youtube": [{"title": "string", "link": "string"}],
    "tools": [{"title": "string", "link": "string"}],
    "related_degrees_in_india": ["string"]
  }
  
  Ensure all links are valid URLs. Provide realistic and diverse suggestions. The salary should be a range (e.g., "₹80,000 - ₹120,000 INR"). If the input is too vague or nonsensical to generate a meaningful roadmap, please return an empty or generic JSON structure with placeholders like "N/A" for strings and empty arrays for lists, but still adhere to the schema.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using a general text model for this task
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            job_title: { type: Type.STRING },
            salary: { type: Type.STRING },
            qualifications: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            courses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  link: { type: Type.STRING },
                },
                required: ["title", "link"],
                propertyOrdering: ["title", "link"],
              },
            },
            youtube: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  link: { type: Type.STRING },
                },
                required: ["title", "link"],
                propertyOrdering: ["title", "link"],
              },
            },
            tools: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  link: { type: Type.STRING },
                },
                required: ["title", "link"],
                propertyOrdering: ["title", "link"],
              },
            },
            related_degrees_in_india: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["job_title", "salary", "qualifications", "courses", "youtube", "tools", "related_degrees_in_india"],
          propertyOrdering: ["job_title", "salary", "qualifications", "courses", "youtube", "tools", "related_degrees_in_india"],
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (jsonStr) {
      const roadmap = parseJsonSafely<CareerRoadmap>(jsonStr);
      
      // Perform semantic validation on the generated roadmap
      if (roadmap) {
        const isJobTitleMeaningful = roadmap.job_title && !['N/A', 'Unknown Job Title'].includes(roadmap.job_title);
        const hasQualifications = roadmap.qualifications && roadmap.qualifications.length > 0;
        const hasCourses = roadmap.courses && roadmap.courses.length > 0;
        const hasYoutube = roadmap.youtube && roadmap.youtube.length > 0;
        const hasTools = roadmap.tools && roadmap.tools.length > 0;
        const hasRelatedDegrees = roadmap.related_degrees_in_india && roadmap.related_degrees_in_india.length > 0;


        if (isJobTitleMeaningful && (hasQualifications || hasCourses || hasYoutube || hasTools || hasRelatedDegrees)) {
          return roadmap;
        } else {
          console.warn("Generated roadmap content is not meaningful:", roadmap);
          return null; // Treat as unacceptable if content is too generic/empty
        }
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    return null;
  }
};