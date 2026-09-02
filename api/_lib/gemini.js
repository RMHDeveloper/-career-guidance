const GEMINI_MODEL = 'gemini-flash-latest';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

function requireKey(apiKey) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in the environment variables.');
  }
}

async function callGemini(apiKey, contents, generationConfig) {
  requireKey(apiKey);

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({ contents, generationConfig }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API Error:', errorText);
    const err = new Error(`Gemini request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part.text)
    .filter(Boolean)
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

// Pull a JSON object/array out of a model response even if it is wrapped in
// markdown fences or has stray text around it.
export function extractJson(text) {
  let candidate = text.trim();

  const fenced = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidate = fenced[1].trim();

  try {
    return JSON.parse(candidate);
  } catch {
    /* fall through to bracket scan */
  }

  const firstObj = candidate.indexOf('{');
  const firstArr = candidate.indexOf('[');
  let start = -1;
  let open = '{';
  let close = '}';
  if (firstArr !== -1 && (firstObj === -1 || firstArr < firstObj)) {
    start = firstArr;
    open = '[';
    close = ']';
  } else if (firstObj !== -1) {
    start = firstObj;
  }

  if (start !== -1) {
    const end = candidate.lastIndexOf(close);
    if (end > start) {
      const slice = candidate.slice(start, end + 1);
      return JSON.parse(slice);
    }
  }

  throw new Error('Could not parse JSON from the model response.');
}

export async function generateJson(prompt, apiKey, options = {}) {
  const text = await callGemini(
    apiKey,
    [{ role: 'user', parts: [{ text: prompt }] }],
    {
      responseMimeType: 'application/json',
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: options.maxOutputTokens ?? 4096,
    }
  );
  return extractJson(text);
}

export async function generateText(contents, apiKey, options = {}) {
  return callGemini(apiKey, contents, {
    temperature: options.temperature ?? 0.6,
    maxOutputTokens: options.maxOutputTokens ?? 2048,
  });
}
