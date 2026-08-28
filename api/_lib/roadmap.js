export async function generateRoadmap(qualification, interests, apiKey) {
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in the environment variables.");
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
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
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API Error:", errorText);
    const err = new Error(`OpenRouter request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return JSON.parse(content);
}
