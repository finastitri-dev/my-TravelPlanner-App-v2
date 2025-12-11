import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelPreferences, ItineraryResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ Missing VITE_GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateItinerary = async (
  prefs: TravelPreferences
): Promise<ItineraryResponse> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.0-pro-preview",
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You MUST return ONLY valid JSON.

JSON FORMAT STRICT:
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

Destination: ${prefs.destination}
Days: ${prefs.duration}
Interests: ${prefs.interests}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    try {
      return JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}$/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      throw new Error("Gemini returned invalid JSON.");
    }
  } catch (error) {
    console.error("❌ Gemini Error:", error);
    throw new Error("Failed to generate itinerary");
  }
};
