/**
 * BEEMVOY AI Travel Planner - Core TypeScript Type Definitions
 */

export type BudgetTier = 'economy' | 'comfort' | 'luxury';
export type TravelPacing = 'relaxed' | 'balanced' | 'fast-paced';
export type TripStatus = 'draft' | 'configuring' | 'locked' | 'booked';
export type RankingBadge = 'Best' | 'Cheapest' | 'Fastest' | 'Top Pick';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership_tier: string;
  pacing: TravelPacing;
  budget_tier: BudgetTier;
  interests: string[];
  updated_at: string;
}

export interface TripFlight {
  id: string;
  airline: string;
  flight_number: string;
  departure: string;
  arrival: string;
  duration: string;
  price_inr: number;
  formatted_price: string;
  badge: RankingBadge;
  origin: string;
  destination: string;
  origin_city: string;
  destination_city: string;
  stops: string;
  cabin: string;
}

export interface TripHotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews_count: number;
  price_per_night_inr: number;
  total_price_inr: number;
  nights: number;
  amenities: string[];
  badge: RankingBadge;
  image_url: string;
  distance_to_center: string;
}

export interface TripActivity {
  id: string;
  title: string;
  category: 'Trek' | 'Estate' | 'Culture' | 'Culinary' | 'Nature' | 'Heritage';
  duration: string;
  rating: number;
  price_per_person_inr: number;
  description: string;
  logistics_note: string;
  image_url: string;
  destination: string;
  is_selected?: boolean;
}

export interface ItineraryWaypoint {
  id: string;
  day: number;
  time: string;
  title: string;
  subtitle: string;
  type: 'flight' | 'hotel' | 'activity' | 'meal' | 'transit';
  cost_inr: number;
  is_visited: boolean;
  logistics_note?: string;
  location?: string;
}

export interface ItineraryDay {
  day: number;
  date_str: string;
  theme: string;
  waypoints: ItineraryWaypoint[];
}

export interface CanonicalTrip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  origin: string;
  days: number;
  dates: string;
  status: TripStatus;
  budget_total_inr: number;
  travellers: number;
  selected_flight: TripFlight | null;
  selected_hotel: TripHotel | null;
  selected_activities: TripActivity[];
  itinerary_days: ItineraryDay[];
  created_at: string;
  updated_at: string;
}

export interface IntentExtractionResult {
  destination: string;
  origin: string;
  duration_days: number;
  start_date: string | null;
  end_date: string | null;
  budget_total_inr: number;
  travellers: number;
  interests: string[];
  travel_pace: TravelPacing;
  missing_fields: string[];
  assumptions: string[];
}
