const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function generateItinerary(payload: ItineraryRequest): Promise<ItineraryResponse> {
  const res = await fetch(`${API_URL}/api/v1/itinerary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail ?? "Failed to generate itinerary");
  }
  return res.json();
}

// ── Types mirrored from backend Pydantic models ────────────────────────────────
export interface ItineraryRequest {
  destination: string;
  origin: string;
  start_date: string;        // "YYYY-MM-DD"
  end_date: string;
  budget_inr?: number;
  trip_type: "solo" | "couple" | "family" | "group" | "expedition";
  travel_style: "adventure" | "leisure" | "pilgrimage" | "budget" | "luxury" | "cultural" | "wildlife";
  num_travelers: number;
  preferred_transport?: string[];
  accommodation_type?: string;
  interests?: string[];
  avoid?: string[];
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  location?: string;
  lat?: number;
  lng?: number;
  duration_minutes?: number;
  cost_inr?: number;
  booking_url?: string;
  content_opportunity?: string;
}

export interface ItineraryDay {
  day_number: number;
  date?: string;
  title: string;
  summary: string;
  activities: Activity[];
  transport_for_day?: string;
  accommodation?: string;
  estimated_cost_inr?: number;
  weather_note?: string;
}

export interface PackingItem {
  category: string;
  item: string;
  essential: boolean;
}

export interface ItineraryResponse {
  itinerary_id: string;
  destination: string;
  origin: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  trip_type: string;
  travel_style: string;
  total_estimated_cost_inr?: number;
  summary: string;
  days: ItineraryDay[];
  packing_list: PackingItem[];
  key_tips: string[];
  best_time_note?: string;
  generated_at: string;
}
