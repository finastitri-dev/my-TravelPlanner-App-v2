import { GoogleGenerativeAI } from "@google/genai";
import { TravelPreferences, ItineraryResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "❌ GEMINI API KEY is missing! Add it in Vercel → Settings → Environment Variables → VITE_GEMINI_API_KEY"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateItinerary = async (
  prefs: TravelPreferences
): Promise<ItineraryResponse> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You MUST return ONLY valid JSON.
No markdown (no \`\`\`).
No explanation.
No reasoning steps.

JSON FORMAT (STRICT):
{
  "destination": "",
  "currency": "IDR",
  "days": [
    {
      "dayNumber": 1,
      "theme": "",
      "activities": [
        {
          "placeName": "",
          "description": "",
          "timeSlot": "",
          "cost": ""
        }
      ]
    }
  ]
}

Rules:
- Output must be valid JSON only.
- All fields must be filled.
- Use simple clean strings.
- No line breaks outside JSON.
- No trailing commas.

Now generate itinerary with:
Destination: ${prefs.destination}
Days: ${prefs.duration}
Interests: ${prefs.interests}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.trim();

    try {
      return JSON.parse(text) as ItineraryResponse;
    } catch (error) {
      console.warn("⚠ JSON parsing failed. Attempting auto-repair...");

      const jsonMatch = text.match(/\{[\s\S]*\}$/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]) as ItineraryResponse;
        } catch {}
      }

      console.error("❌ RAW RESPONSE:", text);
      throw new Error("Gemini returned invalid JSON format.");
    }
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    throw new Error(
      "Failed to generate itinerary. Check your API key or model settings."
    );
  }
};
