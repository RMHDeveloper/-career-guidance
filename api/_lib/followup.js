import { generateText } from './gemini.js';

export async function askFollowUp(roadmap, question, history, apiKey) {
  const briefing = `
You are an expert career guidance assistant for students and professionals in India.

The user has already generated this career roadmap (shown here as JSON):

${JSON.stringify(roadmap, null, 2)}

Answer the user's follow-up questions about this roadmap and career path.

Rules:
- Be specific, practical and honest about the Indian job market.
- Keep answers under 150 words unless the user asks for more detail.
- Use plain text. No markdown headings, no asterisks for bold.
- When useful, end with 1-3 concrete next steps.
`;

  const contents = [
    { role: 'user', parts: [{ text: briefing }] },
    { role: 'model', parts: [{ text: 'Understood. Ask me anything about this roadmap.' }] },
    ...(Array.isArray(history) ? history : []).map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.text || '') }],
    })),
    { role: 'user', parts: [{ text: question }] },
  ];

  const answer = await generateText(contents, apiKey, {
    temperature: 0.6,
    maxOutputTokens: 2048,
  });

  return { answer };
}
