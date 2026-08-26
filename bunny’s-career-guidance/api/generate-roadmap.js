import { generateRoadmap } from './_lib/roadmap.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { qualification, interests } = req.body || {};
  if (!qualification || !interests) {
    res.status(400).json({ error: 'qualification and interests are required' });
    return;
  }

  try {
    const roadmap = await generateRoadmap(qualification, interests, process.env.OPENROUTER_API_KEY);
    res.status(200).json(roadmap);
  } catch (err) {
    console.error('generate-roadmap error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
}
