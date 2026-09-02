import { generateJson } from './gemini.js';

export async function generateResumeKit(
  { jobTitle, qualification, interests, currentSkills, experience },
  apiKey
) {
  const prompt = `
You are an expert resume writer and career coach for the Indian job market.

Target role: ${jobTitle}
Candidate qualification: ${qualification}
Candidate interests: ${interests}
Skills the candidate has: ${currentSkills && currentSkills.trim() ? currentSkills : '(not specified)'}

What the candidate has actually done (projects, internships, work, coursework, achievements):
${experience && experience.trim() ? experience : '(the candidate did not describe specific work - write beginner-friendly bullets they can adapt once they build small projects)'}

Write resume and LinkedIn content aimed at landing the target role.

Return ONLY valid JSON using exactly this structure:

{
  "linkedin_headline": "one line, under 120 characters, no hashtags",
  "summary": "2-4 sentence professional summary written in first person implied (no 'I'), tailored to the target role",
  "bullets": ["achievement-oriented resume bullet", "..."],
  "skills_to_list": ["skill", "skill", "skill"]
}

Requirements:
- 5-6 resume bullets. Each starts with a strong action verb, is one sentence, and shows impact or a concrete outcome. Add a realistic metric only when the candidate's description supports it - never invent specific numbers.
- If the candidate gave no real experience, write bullets grounded in the kind of starter projects someone learning this role would do, and keep them honest.
- skills_to_list: 8-12 concrete, ATS-friendly skills for this role.
- Plain strings. No markdown, no asterisks, no leading dashes. Return JSON only.
`;

  return generateJson(prompt, apiKey, { temperature: 0.5, maxOutputTokens: 2048 });
}
