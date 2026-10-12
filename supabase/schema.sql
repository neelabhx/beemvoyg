-- ==============================================================================
-- BEEMVOYG — Supabase PostgreSQL Schema & Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  membership_tier TEXT DEFAULT 'Beemvoyg Verified Explorer',
  pacing TEXT DEFAULT 'balanced' CHECK (pacing IN ('relaxed', 'balanced', 'fast-paced')),
  budget_tier TEXT DEFAULT 'comfort' CHECK (budget_tier IN ('economy', 'comfort', 'luxury')),
  interests TEXT[] DEFAULT ARRAY['Mountain Treks', 'Tea Plantations'],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies: Strict user-only access based on auth.uid()
DROP POLICY IF EXISTS "Profiles: Users can only read their own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can only read their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Users can only insert their own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can only insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Users can only update their own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can only update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles: Users can only delete their own profile" ON public.profiles;
CREATE POLICY "Profiles: Users can only delete their own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin TEXT DEFAULT 'BLR',
  days INTEGER NOT NULL DEFAULT 3,
  dates TEXT,
  status TEXT DEFAULT 'configuring' CHECK (status IN ('draft', 'configuring', 'locked', 'booked')),
  budget_total_inr INTEGER DEFAULT 30000,
  travellers INTEGER DEFAULT 2,
  selected_flight JSONB,
  selected_hotel JSONB,
  selected_activities JSONB DEFAULT '[]'::jsonb,
  itinerary_days JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);

-- Enable Row Level Security on trips
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Trips RLS Policies: Strict user-only access based on auth.uid()
DROP POLICY IF EXISTS "Trips: Users can only read their own trips" ON public.trips;
CREATE POLICY "Trips: Users can only read their own trips"
  ON public.trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trips: Users can only create their own trips" ON public.trips;
CREATE POLICY "Trips: Users can only create their own trips"
  ON public.trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trips: Users can only update their own trips" ON public.trips;
CREATE POLICY "Trips: Users can only update their own trips"
  ON public.trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Trips: Users can only delete their own trips" ON public.trips;
CREATE POLICY "Trips: Users can only delete their own trips"
  ON public.trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Bookings Table (Flights, Stays, and Package Reservations)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  trip_id TEXT REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'activity', 'package')),
  reference_code TEXT NOT NULL,
  total_amount_inr INTEGER NOT NULL,
  booking_details JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON public.bookings(trip_id);

-- Enable Row Level Security on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings RLS Policies: Strict user-only access based on auth.uid()
DROP POLICY IF EXISTS "Bookings: Users can only read their own bookings" ON public.bookings;
CREATE POLICY "Bookings: Users can only read their own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Bookings: Users can only insert their own bookings" ON public.bookings;
CREATE POLICY "Bookings: Users can only insert their own bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Bookings: Users can only update their own bookings" ON public.bookings;
CREATE POLICY "Bookings: Users can only update their own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Bookings: Users can only delete their own bookings" ON public.bookings;
CREATE POLICY "Bookings: Users can only delete their own bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

