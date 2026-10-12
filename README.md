# ✈️ BEEMVOYG — India-First AI Travel Planner

**BEEMVOYG** is an AI-powered travel planning assistant that helps travelers turn natural language requests into organized, personalized trip plans. Designed for individual travelers, couples, and small groups, it brings trip planning, flight and hotel discovery, activity exploration, and day-by-day itinerary management into one mobile-first experience. It aims to reduce the time and effort spent switching between multiple platforms by helping users discover travel options, organize activities, and manage their trip in one place.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Node.js/Express**, **Google Gemini 3.8 Flash**, and **Supabase**, it provides a high-fidelity travel planning experience enclosed in a sleek, responsive mobile viewport profile (**390 × 844 px**).

---

## 📱 Core Features & User Experience

1. **Authentication & Onboarding:**
   - Mandatory Email & Password authentication and Google OAuth with multi-user isolation.
   - Interactive traveler preference onboarding:
     - **Budget Tier:** Economy (₹), Comfort (₹₹), Luxury (₹₹₹)
     - **Travel Pacing:** Relaxed, Balanced, Fast-Paced
     - **Experience Pills:** Mountain Treks, Tea Plantations, Heritage, Beaches, Wildlife & Safari, Food & Spice

2. **Intent Synthesis Dashboard (`Home`):**
   - Natural language prompt synthesis powered by server-side **Gemini 3.8 Flash** with a deterministic India-tuned heuristic fallback engine.
   - Quick prompt shortcuts (e.g., *"3 days in Munnar under ₹30,000"*, *"Weekend in Goa under ₹15,000"*, *"4 days royal heritage in Jaipur"*).
   - Live committed spend tracker vs. target budget meter with progress indicators.

3. **Unified Bookings (`Flights & Stays`):**
   - Consolidated logistics hub merging Flights and Hotels into a single view.
   - **Google Flights:** Scannable flight cards with **Best**, **Cheapest**, and **Fastest** badges, baggage allowances, cabin class, and non-stop flight routes.
   - **Google Hotels:** Curated boutique stays with star ratings, amenity filters, and transparent **nightly rates vs. total trip stay pricing** to prevent surprise checkout costs.

4. **Activity Discovery (`Explore`):**
   - Categorized experiential activities (Treks, Tea Estates, Culture, Heritage, Culinary, Nature).
   - Practical logistics field notes, durations, user ratings, and interactive one-tap additions with tactile feedback (`active:scale-95`).

5. **Unified Trip Hub (`My Trip & Ledger`):**
   - **Chronological Timeline:** Continuous vertical connector line linking flights, hotel check-ins, morning treks, and evening dinners with interactive waypoint completion toggles.
   - **Split Ledger & Payment:** Itemized cost tally, companion split calculator (1–6 travelers), one-tap shareable split link, and simulated UPI (Google Pay, PhonePe, Paytm) / Credit Card checkout.

6. **Account & Preferences (`Profile`):**
   - User-isolated profile settings with an inline slide-over bottom sheet editor and instant session purge upon sign-out.

---

## 🛠️ Tech Stack Manifest

* **Client Framework:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`), TypeScript (`typescript: ^7.0.2`), Vite 8
* **Styling & Micro-Interactions:** Tailwind CSS v4 (`@tailwindcss/vite: ^4.3.3`), Lucide React (`lucide-react: ^0.546.0`), Motion
* **Server & API Proxy:** Node.js, Express (`express: ^4.21.2`), `tsx` runner
* **AI Generation:** Google Gemini 3.8 Flash (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK
* **Search Engine Integration:** SerpApi Google Flights, Hotels, Local, and Events via a secure server proxy
* **Database & Authentication:** Supabase PostgreSQL with Row Level Security (RLS) policies and user-scoped storage isolation

---

## 🔒 Backend, Security & API Proxy Architecture

### 1. Server-Side Key Gating (`server.ts`)
- **Exclusive API Proxy**: All external calls to **Gemini 3.8 Flash** (`POST /api/parse-intent`) and **SerpApi** (`POST /api/search`) run exclusively through `server.ts`.
- **Secret Isolation**: Secret keys (`GEMINI_API_KEY`, `SERPAPI_API_KEY`) remain strictly on the backend (`process.env`) and are never exposed in client bundles or network responses.
- **Security Headers & Caching**: All `/api/*` endpoints enforce:
  ```http
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
  Pragma: no-cache
  Expires: 0
  ```
- **Input Sanitization**: Request bodies are restricted with payload size limits (`500kb`) and inputs are sanitized to prevent injection or memory bloat.

### 2. SerpApi Search Engines & Normalization
The proxy endpoint `POST /api/search` integrates with the following SerpApi engines:
- **Google Flights (`google_flights`)**: Departure and arrival search with INR currency and India regional settings (`currency: 'INR'`, `gl: 'in'`, `hl: 'en'`).
- **Google Hotels (`google_hotels`)**: Location and property search with ratings, amenities, and pricing.
- **Google Local (`google_local`)**: Local sights, attractions, and tour discovery.
- **Google Events (`google_events`)**: Regional festivals, cultural fairs, and live events.

**Mock & Live Search Behavior**:
- When `USE_MOCK_DATA="true"`, the server returns curated results from `src/data/mock-data.json` without making live network requests.
- When `USE_MOCK_DATA="false"`, the proxy sends requests to SerpApi using the server-side API key.
- If upstream rate limits or errors occur, the server automatically and transparently falls back to sanitized mock data, guaranteeing zero client crashes.

### 3. Database Security & Row Level Security (RLS)
The database schema (`supabase/schema.sql`) enforces PostgreSQL Row Level Security (RLS) policies:
- **`public.profiles`**: Authenticated users can only read, insert, update, and delete their own profile (`auth.uid() = id`).
- **`public.trips`**: Authenticated users can only access and modify their own trips (`auth.uid() = user_id`).
- **Session Verification**: `src/lib/database.ts` verifies the Supabase JWT session (`supabase.auth.getUser()`) before querying or mutating rows.
- **Multi-User Client Isolation**: When offline or in fallback mode, client caching uses user-namespaced storage tokens (`beemvoy_{key}_{safeUserId}`). Signing out purges both authentication credentials and user-scoped data.

---

## 📐 Mobile Viewport Profile

* **Chassis Profile:** Enclosed inside a fixed mobile container styled at **390 × 844 px** (iPhone 13/14/15/16 Pro standard profile) with a responsive desktop ambient backdrop.
* **Safe-Area Padding:** `pt-10` top safe-area padding and `pb-28` bottom navigation padding across all views to prevent content from clipping behind system headers or the bottom navigation bar.
* **Tactile Micro-Interactions:** All cards, prompt pills, filter tabs, and action buttons implement `active:scale-95 transition-transform duration-150` for native-like touch feedback.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Clone and Install
```bash
git clone https://github.com/neelabhx/beemvoyg.git
cd beemvoyg
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Gemini API Key (Required for server-side AI intent parsing)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: SerpApi Key for live Google Flights/Hotels/Local/Events
SERPAPI_API_KEY=""

# Optional: Force mock data mode ('true' or 'false')
USE_MOCK_DATA="false"

# Optional: Supabase Project Configuration
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
VITE_USE_MOCK_DATA="true"
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` running Express with Vite middleware.

### 5. Production Build & Start
```bash
npm run build
npm run start
```

---

## 🧭 Project Structure

```
├── .env.example
├── index.html                   # HTML entry point with BEEMVOYG metadata & Google Fonts
├── metadata.json
├── package.json
├── server.ts                    # Express server proxy (Gemini 3.8 Flash, SerpApi, security middleware)
├── supabase/
│   └── schema.sql               # PostgreSQL schema & Row Level Security (RLS) policies
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # Main application orchestrator & 5-tab routing
│   ├── index.css                # Global Tailwind CSS and custom slim scrollbar styles
│   ├── data/
│   │   └── mock-data.json       # Curated India travel reference dataset (Munnar, Goa, Jaipur)
│   ├── components/
│   │   ├── PhoneFrame.tsx       # 390 × 844 px mobile chassis with dynamic header
│   │   ├── BottomNav.tsx        # Streamlined 5-tab mobile navigation bar
│   │   ├── AuthScreen.tsx       # Mandatory authentication & traveler preference onboarding
│   │   ├── HomeScreen.tsx       # Intent prompt box & live budget meter
│   │   ├── BookingsScreen.tsx   # Unified Flights & Hotels logistics hub
│   │   ├── ExploreScreen.tsx    # Curated local activity discovery
│   │   ├── TripScreen.tsx       # Unified Day-by-Day Timeline & Smart Split Ledger
│   │   ├── ProfileScreen.tsx    # Traveler preferences & account settings
│   │   └── InlineProfileEditModal.tsx # Slide-over bottom sheet editor
│   ├── lib/
│   │   ├── database.ts          # Multi-user isolated storage layer & session verification
│   │   ├── mockData.ts          # Static tourism data & itinerary generator
│   │   └── supabase.ts          # Supabase client with JWT validation guard
│   └── types/
│       └── trip.ts              # Canonical trip, flight, hotel, and profile TypeScript interfaces
└── tsconfig.json
```

---

## 🧪 Testing & Verification

- **Lint & Strict Type-Checking:**
  ```bash
  npm run lint
  ```
- **Production Build Verification:**
  ```bash
  npm run build
  ```
