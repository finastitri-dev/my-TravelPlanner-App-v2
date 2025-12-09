import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelPreferences, ItineraryResponse } from "../types";

// AMBIL API KEY DENGAN CARA YANG BENAR UNTUK VITE + NETLIFY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI API KEY is missing! Add it in Netlify → Environment Variables → VITE_GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ apiKey });

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    currency: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                placeName: { type: Type.STRING },
                description: { type: Type.STRING },
                timeSlot: { type: Type.STRING },
                cost: { type: Type.STRING },
              },
              required: ["placeName", "description", "timeSlot", "cost"],
            },
          },
        },
        required: ["dayNumber", "theme", "activities"],
      },
    },
  },
  required: ["destination", "currency", "days"],
};

export const generateItinerary = async (
  prefs: TravelPreferences
): Promise<ItineraryResponse> => {
  try {
    const prompt = `
      Create a detailed ${prefs.duration}-day travel itinerary for ${prefs.destination}.
      User Interests: ${prefs.interests}
      Output JSON ONLY.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You are a world-class travel planner. Respond in JSON ONLY.",
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ItineraryResponse;
    }

    throw new Error("No itinerary generated.");
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};
