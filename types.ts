export interface Activity {
  placeName: string;
  description: string;
  timeSlot: string; // e.g. "09:00 - 11:00"
  cost: string; // e.g. "¥500" or "Free"
}

export interface DayPlan {
  dayNumber: number;
  theme: string; // e.g. "Historical Temples"
  activities: Activity[];
}

export interface ItineraryResponse {
  destination: string;
  currency: string;
  days: DayPlan[];
}

export interface TravelPreferences {
  destination: string;
  duration: number;
  interests: string;
}