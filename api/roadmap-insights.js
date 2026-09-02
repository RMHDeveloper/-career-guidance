import { generateInsights } from './_lib/insights.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { qualification, interests, currentSkills, jobTitle } = req.body || {};
  if (!qualification || !interests) {
    res.status(400).json({ error: 'qualification and interests are required' });
    return;
  }

  try {
    const insights = await generateInsights(
      { qualification, interests, currentSkills, jobTitle },
      process.env.GEMINI_API_KEY
    );
    res.status(200).json(insights);
  } catch (err) {
    console.error('roadmap-insights error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
}
