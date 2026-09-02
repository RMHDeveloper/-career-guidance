import { generateJson } from './gemini.js';

export async function generateInsights(
  { qualification, interests, currentSkills, jobTitle },
  apiKey
) {
  const prompt = `
You are an expert career guidance assistant for students and professionals in India.

The user is targeting this career: ${jobTitle || `(derive it from the qualification and interests below)`}

User qualification:
${qualification}

User interests:
${interests}

Skills the user already has (may be empty):
${currentSkills && currentSkills.trim() ? currentSkills : '(none provided)'}

Produce a deep-dive on this career for the Indian context.

Return ONLY valid JSON using exactly this structure:

{
  "timeline": [
    {
      "period": "Months 0-3",
      "focus": "short phase title",
      "steps": ["concrete action item", "concrete action item"]
    }
  ],
  "skill_gap": [
    {
      "skill": "skill name",
      "status": "have | partial | gap",
      "note": "one short line on what to do about it"
    }
  ],
  "day_in_life": {
    "summary": "one honest paragraph about what the work actually feels like day to day",
    "typical_tasks": ["task", "task", "task"],
    "pros": ["pro", "pro"],
    "cons": ["con", "con"],
    "suits_you_if": ["trait or preference", "trait or preference"],
    "common_reasons_people_leave": ["reason", "reason"]
  },
  "reality_check": "one honest paragraph that pushes back on hype: how hard it is to break in, realistic starting pay, competition, and what most beginners get wrong",
  "job_market": {
    "demand_outlook": "2-3 sentences on current demand in India",
    "top_hiring_cities": ["city", "city", "city"],
    "typical_employers": ["company or company type", "company or company type"],
    "work_arrangements": "1-2 sentences: is it freelance friendly, remote friendly, contract vs full time",
    "government_exam_routes": ["exam or PSU route if any, else say 'No major government route'"]
  }
}

Requirements:
- timeline: exactly 4 phases covering roughly the first 12-18 months, each with 2-4 steps.
- skill_gap: 5-7 rows. If the user listed skills, mark those "have" or "partial" honestly; everything else important is a "gap". If no skills were provided, base status on the typical fresh graduate with the stated qualification.
- Use "have", "partial" or "gap" for status - nothing else.
- Salary and money references in Indian Rupees.
- Be specific to India. Name real cities and real types of employers.
- Plain strings only. No markdown, no asterisks. Return JSON only.
`;

  return generateJson(prompt, apiKey, { temperature: 0.4, maxOutputTokens: 6144 });
}
