import { generateJson } from './gemini.js';

export async function generateRoadmap(qualification, interests, apiKey) {
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

  return generateJson(prompt, apiKey, { temperature: 0.4, maxOutputTokens: 2048 });
}
