import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TravelPreferences, ItineraryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING, description: "The confirmed destination name" },
    currency: { type: Type.STRING, description: "The local currency symbol or code (e.g. JPY, USD, EUR)" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "A short theme title for the day" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                placeName: { type: Type.STRING },
                description: { type: Type.STRING, description: "Short engaging description of the activity" },
                timeSlot: { type: Type.STRING, description: "Opening hours or recommended time slot (e.g., '09:00 - 10:30')" },
                cost: { type: Type.STRING, description: "Estimated cost per person in local currency" },
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

export const generateItinerary = async (prefs: TravelPreferences): Promise<ItineraryResponse> => {
  try {
    const prompt = `
      Create a detailed ${prefs.duration}-day travel itinerary for ${prefs.destination}.
      User Interests: ${prefs.interests}.
      
      Requirements:
      1. Provide a realistic daily schedule.
      2. Include estimated costs in local currency.
      3. Mention opening/closing times where relevant in the timeSlot field.
      4. Ensure the plan covers exactly ${prefs.duration} days.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class expert Travel Planner AI. You provide detailed, logistical, and culturally rich travel itineraries. You must output JSON.",
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4, // Lower temperature for more grounded plans
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ItineraryResponse;
    } else {
      throw new Error("No itinerary generated.");
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
};