import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeForAI } from './validation';

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateEventDetails(
  eventIdea: string,
  location: string,
  datetime: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Sanitize inputs to prevent prompt injection
  const safeIdea = sanitizeForAI(eventIdea);
  const safeLocation = sanitizeForAI(location);
  const safeDatetime = sanitizeForAI(datetime);

  const prompt = `Generate event details for the following event:

Event Idea: ${safeIdea}
Location: ${safeLocation}
Date/Time: ${safeDatetime}

Please provide:
1. A catchy, creative event title (max 60 characters)
2. An engaging event description (2-3 sentences)
3. A suggested itinerary with 3-5 time-based activities

Format your response as JSON:
{
  "title": "...",
  "description": "...",
  "itinerary": [
    { "time": "...", "activity": "..." },
    ...
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse Gemini response');
  } catch (error: any) {
    console.error('Gemini API error details:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
      response: error?.response,
    });
    throw error;
  }
}

export async function generateVenueSuggestions(
  eventIdea: string,
  location: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Sanitize inputs to prevent prompt injection
  const safeIdea = sanitizeForAI(eventIdea);
  const safeLocation = sanitizeForAI(location);

  const prompt = `Suggest 2 suitable venues for this event:

Event Type: ${safeIdea}
Location: ${safeLocation}

For each venue suggestion, provide:
1. Venue name (can be general like "Community Park" or "Downtown Restaurant")
2. Venue type (e.g., "park", "restaurant", "event space")
3. Brief reason why it's suitable (1 sentence)

Format as JSON:
{
  "venues": [
    { "name": "...", "type": "...", "reason": "..." },
    { "name": "...", "type": "...", "reason": "..." }
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse Gemini response');
  } catch (error: any) {
    console.error('Gemini venue suggestions error details:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
    });
    throw error;
  }
}

export async function extractGiphyKeywords(
  eventIdea: string,
  eventTitle?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Sanitize inputs to prevent prompt injection
  const safeIdea = sanitizeForAI(eventIdea);
  const safeTitle = eventTitle ? sanitizeForAI(eventTitle) : '';

  const prompt = `Extract 1-3 relevant keywords from this event context for finding a GIF on GIPHY.
Focus on the vibe, mood, theme, or key visual elements.
Remove unnecessary details like numbers, names, locations.

Event Idea: ${safeIdea}
${safeTitle ? `Event Title: ${safeTitle}` : ''}

Examples:
- "My 25th gothic birthday party with 15 people" → "gothic party celebration"
- "Casual team building event outdoors" → "team celebration outdoors"
- "Elegant wedding reception dinner" → "elegant wedding celebration"
- "Fun summer BBQ gathering at the park" → "summer BBQ party"

Respond with ONLY the keywords, no extra text or formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Remove quotes if present
    return text.replace(/^["']|["']$/g, '');
  } catch (error: any) {
    console.error('Gemini keyword extraction error details:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
    });
    // Fallback: just return the event idea as-is
    return eventIdea;
  }
}

export async function parseVenueContext(
  userInput: string
): Promise<{ venueType: string; location: string }> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Sanitize input to prevent prompt injection
  const safeInput = sanitizeForAI(userInput);

  const prompt = `Parse this user input to separate the venue type from the location.

User Input: "${safeInput}"

Examples:
- "speakeasy west LA" → venueType: "speakeasy", location: "West LA"
- "rooftop bar downtown" → venueType: "rooftop bar", location: "downtown"
- "casual restaurant Santa Monica" → venueType: "casual restaurant", location: "Santa Monica"
- "outdoor park Brooklyn" → venueType: "outdoor park", location: "Brooklyn"
- "West LA" (no venue type) → venueType: "", location: "West LA"
- "speakeasy" (no location) → venueType: "speakeasy", location: ""

Format as JSON:
{
  "venueType": "...",
  "location": "..."
}

Respond with ONLY the JSON, no extra text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        venueType: parsed.venueType || '',
        location: parsed.location || '',
      };
    }

    throw new Error('Failed to parse venue context');
  } catch (error: any) {
    console.error('Gemini venue parsing error details:', {
      message: error?.message,
      status: error?.status,
      statusText: error?.statusText,
    });
    // Fallback: return original input as venue type
    return {
      venueType: userInput,
      location: '',
    };
  }
}
