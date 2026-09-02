import { generateResumeKit } from './_lib/resume.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { jobTitle, qualification, interests, currentSkills, experience } = req.body || {};
  if (!jobTitle || !qualification) {
    res.status(400).json({ error: 'jobTitle and qualification are required' });
    return;
  }

  try {
    const kit = await generateResumeKit(
      { jobTitle, qualification, interests, currentSkills, experience },
      process.env.GEMINI_API_KEY
    );
    res.status(200).json(kit);
  } catch (err) {
    console.error('resume-bullets error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
}
