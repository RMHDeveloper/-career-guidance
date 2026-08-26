import { CareerRoadmap } from "../types";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

export const generateCareerRoadmap = async (
  qualification: string,
  interests: string
): Promise<CareerRoadmap | null> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not set in the environment variables."
    );
  }

  const prompt = `
You are an expert career guidance assistant for students and professionals in India.

Based on the user's qualification and interests, create a practical career roadmap.

Qualification:
${qualification}

Interests:
${interests}

Return ONLY valid JSON using exactly this structure:

{
  "job_title": "string",
  "salary": "string",
  "qualifications": ["string"],
  "courses": [
    {
      "title": "string",
      "link": "string"
    }
  ],
  "youtube": [
    {
      "title": "string",
      "link": "string"
    }
  ],
  "tools": [
    {
      "title": "string",
      "link": "string"
    }
  ],
  "related_degrees_in_india": ["string"]
}

Requirements:

- Give salary ranges in Indian Rupees.
- Recommend realistic careers in India.
- Give 3 useful online courses.
- Give 3 useful YouTube channels.
- Give 3 useful tools.
- Give 3 related degrees available in India.
- Use valid URLs where possible.
- Do not include markdown.
- Return JSON only.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },

        body: JSON.stringify({
          model: "google/gemini-2.5-flash",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          response_format: {
            type: "json_object",
          },

          temperature: 0.4,
          max_tokens: 2048,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("OpenRouter API Error:", errorText);

      throw new Error(
        `OpenRouter request failed with status ${response.status}`
      );
    }

    const data: OpenRouterResponse = await response.json();

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenRouter returned an empty response.");
    }

    const roadmap = JSON.parse(content) as CareerRoadmap;

    return roadmap;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    return null;
  }
};