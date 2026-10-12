# ✈️ BEEMVOYG — India-First AI Travel Planner

**BEEMVOYG** is a mobile-optimized AI travel planning MVP designed to turn natural language prompts into fully synchronized, day-by-day itineraries, flight & hotel discovery, and smart expense splitting. Built with React 19, TypeScript, Tailwind CSS, Node.js/Express, Google Gemini 3.8 Flash, and Supabase, it provides a seamless travel planning experience enclosed in a sleek, responsive mobile viewport.

---

## 📱 Core Features

1. **Authentication & Onboarding:**
   - Mandatory Email & Password authentication and Google OAuth.
   - Interactive traveler preference onboarding: Budget Tier (Economy, Comfort, Luxury), Travel Pacing (Relaxed, Balanced, Fast-Paced), and Interest pills (Treks, Plantations, Heritage, Beaches, Wildlife, Food & Spice).

2. **Intent Synthesis Dashboard:**
   - Natural language prompt synthesis powered by server-side Gemini 3.8 Flash with a deterministic India-tuned heuristic fallback engine.
   - Quick prompt shortcuts (e.g., *"3 days in Munnar under ₹30,000"*, *"Weekend in Goa under ₹15,000"*, *"4 days royal heritage in Jaipur"*).
   - Live committed spend tracker vs. target budget meter.

3. **Unified Bookings (`Flights & Stays`):**
   - Merged logistics hub allowing travelers to curate both Flights and Hotels in a single place.
   - **Flights:** Scannable flight cards with distinct **Best**, **Cheapest**, and **Fastest** badges, baggage allowance, and non-stop flight routes.
   - **Hotels:** Curated boutique stays with star ratings, amenity filters, and transparent **nightly rates vs. total trip stay pricing** to prevent checkout surprises.

4. **Activity Discovery (`Explore`):**
   - Categorized experiential activities (Treks, Tea Estates, Culture, Heritage, Culinary, Nature).
   - Practical logistics field notes, durations, and interactive one-tap additions with tactile feedback.

5. **Unified Trip Hub (`My Trip & Ledger`):**
   - **Chronological Timeline:** Continuous vertical connector line linking flights, hotel check-ins, morning treks, and evening dinners with interactive waypoint completion toggles.
   - **Split Ledger & Payment:** Itemized cost tally, companion split calculator (1–6 travelers), one-tap shareable split link, and simulated UPI (GPay, PhonePe, Paytm) / Card checkout.

6. **Account & Preferences:**
   - Multi-user isolated profile settings with an inline slide-over bottom sheet editor and instant session purge upon sign-out.

---

## 🛠️ Tech Stack

* **Client Framework:** React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`), TypeScript (`typescript: ^7.0.2`), Vite 8
* **Styling & Icons:** Tailwind CSS v4 (`@tailwindcss/vite: ^4.3.3`), Lucide React (`lucide-react: ^0.546.0`), Motion
* **Server & Proxy:** Node.js, Express (`express: ^4.21.2`), `tsx` runner
* **AI Engine:** Google Gemini 3.8 Flash (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK
* **Search Integration:** Server-side SerpApi / Google Flights & Hotels Proxy (`/api/search`) with defensive stateless mock fallback
* **Authentication & Database:** Supabase PostgreSQL with Row Level Security (RLS) policies and user-scoped local persistence

---

## 🔒 Security & Multi-User Architecture

* **Server-Side API Key Protection:** Private secrets (`GEMINI_API_KEY`, `SERPAPI_API_KEY`) remain strictly on the backend (`server.ts`) and are never exposed in browser bundles.
* **Strict Statelessness:** Backend proxy endpoints (`/api/*`) send `Cache-Control: no-store, no-cache, must-revalidate` headers and avoid global in-memory session variables.
* **Defensive Cloning:** Mock datasets are frozen (`Object.freeze`) and defensively duplicated with `structuredClone()` to prevent cross-request state contamination.
* **Row Level Security (RLS):** Supabase database tables (`profiles`, `trips`) filter records strictly by `auth.uid() = id` / `auth.uid() = user_id`.
* **User-Scoped Isolation & Session Purge:** Client caching uses user-namespaced storage tokens (`beemvoy_{key}_{user_id}`). Signing out invalidates authentication tokens and purges all local cached data.

---

## 📐 Mobile Viewport Constraints

* **Chassis Profile:** Fixed mobile container styled at **390 × 844 px** (iPhone Pro profile) with responsive desktop backdrop.
* **Safe-Area Padding:** `pt-10` top safe-area padding and `pb-28` bottom navigation padding across all tab containers.
* **Micro-Interactions:** All interactive cards, pills, filter tabs, and action buttons implement `active:scale-95 transition-transform duration-150` for native tactile feel.

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/neelabhx/beemvoyg.git
cd beemvoyg
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Server-side Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: SerpApi Key for live Google Flights & Hotels queries
SERPAPI_API_KEY=""

# Optional: Force mock data mode ('true' or 'false')
USE_MOCK_DATA="false"

# Optional: Supabase project configuration (falls back to local isolated engine if unconfigured)
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
VITE_USE_MOCK_DATA="true"
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000` running Express with Vite middleware.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🧭 Project Structure

```
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts                    # Express server proxy (Gemini 3.8 Flash, SerpApi, Vite middleware)
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # Main application orchestrator & tab routing
│   ├── index.css                # Global Tailwind CSS and custom scrollbars
│   ├── components/
│   │   ├── PhoneFrame.tsx       # 390 × 844 px mobile chassis wrapper
│   │   ├── BottomNav.tsx        # Streamlined 5-tab mobile navigation bar
│   │   ├── AuthScreen.tsx       # Mandatory authentication & traveler onboarding
│   │   ├── HomeScreen.tsx       # Intent prompt box & live budget meter
│   │   ├── BookingsScreen.tsx   # Merged Flights & Hotels hub
│   │   ├── ExploreScreen.tsx    # Curated local activity discovery
│   │   ├── TripScreen.tsx       # Merged Day-by-Day Timeline & Split Ledger
│   │   ├── ProfileScreen.tsx    # Traveler preferences & account settings
│   │   └── InlineProfileEditModal.tsx # Slide-over preferences editor
│   ├── lib/
│   │   ├── database.ts          # Multi-user isolated storage layer & session purge
│   │   ├── mockData.ts          # India travel reference dataset (Munnar, Goa, Jaipur)
│   │   └── supabase.ts          # Supabase client with JWT validation guard
│   └── types/
│       └── trip.ts              # Canonical trip, flight, hotel, and profile TypeScript interfaces
└── tsconfig.json
```

---

## 🧪 Testing & Verification

Run strict TypeScript type verification:
```bash
npm run lint
```
Build bundle verification:
```bash
npm run build
```
