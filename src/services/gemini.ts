import { GoogleGenerativeAI } from "@google/generative-ai";
import { TravelPreferences, ItineraryResponse } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI API KEY is missing! Add it in Vercel → Settings → Environment Variables → VITE_GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateItinerary = async (
  prefs: TravelPreferences
): Promise<ItineraryResponse> => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      Create a detailed ${prefs.duration}-day travel itinerary for ${prefs.destination}.
      User Interests: ${prefs.interests}
      Respond in valid JSON ONLY.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return JSON.parse(text) as ItineraryResponse;
  } catch (error) {
    console.error("❌ Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. Check your API key or model settings.");
  }
};
