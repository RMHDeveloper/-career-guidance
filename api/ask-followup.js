import { askFollowUp } from './_lib/followup.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { roadmap, question, history } = req.body || {};
  if (!roadmap || !question) {
    res.status(400).json({ error: 'roadmap and question are required' });
    return;
  }

  try {
    const result = await askFollowUp(
      roadmap,
      question,
      Array.isArray(history) ? history : [],
      process.env.GEMINI_API_KEY
    );
    res.status(200).json(result);
  } catch (err) {
    console.error('ask-followup error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
}
