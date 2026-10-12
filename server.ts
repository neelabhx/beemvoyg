import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Strict statelessness: Cache-Control headers on all API responses
app.use(express.json());

app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Frozen immutable reference dataset for defensive cloning
const FROZEN_MOCK_DATA = Object.freeze({
  flights: {
    Munnar: [
      {
        id: 'flt-blr-cok-01',
        airline: 'IndiGo',
        flight_number: '6E-512',
        departure: '06:15 AM',
        arrival: '07:30 AM',
        duration: '1h 15m',
        price_inr: 3850,
        formatted_price: '₹3,850',
        badge: 'Best',
        origin: 'BLR',
        destination: 'COK',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Kochi (COK) - Munnar Gateway',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-cok-02',
        airline: 'Akasa Air',
        flight_number: 'QP-1382',
        departure: '08:45 AM',
        arrival: '10:05 AM',
        duration: '1h 20m',
        price_inr: 3200,
        formatted_price: '₹3,200',
        badge: 'Cheapest',
        origin: 'BLR',
        destination: 'COK',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Kochi (COK)',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-cok-03',
        airline: 'Air India Express',
        flight_number: 'IX-143',
        departure: '05:40 AM',
        arrival: '06:50 AM',
        duration: '1h 10m',
        price_inr: 4450,
        formatted_price: '₹4,450',
        badge: 'Fastest',
        origin: 'BLR',
        destination: 'COK',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Kochi (COK)',
        stops: 'Non-stop',
        cabin: 'Economy Prime'
      }
    ],
    Goa: [
      {
        id: 'flt-blr-goi-01',
        airline: 'IndiGo',
        flight_number: '6E-645',
        departure: '07:00 AM',
        arrival: '08:15 AM',
        duration: '1h 15m',
        price_inr: 3499,
        formatted_price: '₹3,499',
        badge: 'Best',
        origin: 'BLR',
        destination: 'GOI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Goa Dabolim (GOI)',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-goi-02',
        airline: 'SpiceJet',
        flight_number: 'SG-103',
        departure: '10:30 AM',
        arrival: '11:55 AM',
        duration: '1h 25m',
        price_inr: 2950,
        formatted_price: '₹2,950',
        badge: 'Cheapest',
        origin: 'BLR',
        destination: 'GOI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Goa (GOX)',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-goi-03',
        airline: 'Air India',
        flight_number: 'AI-581',
        departure: '06:00 AM',
        arrival: '07:10 AM',
        duration: '1h 10m',
        price_inr: 4200,
        formatted_price: '₹4,200',
        badge: 'Fastest',
        origin: 'BLR',
        destination: 'GOI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Goa (GOI)',
        stops: 'Non-stop',
        cabin: 'Premium Economy'
      }
    ],
    Jaipur: [
      {
        id: 'flt-blr-jai-01',
        airline: 'IndiGo',
        flight_number: '6E-481',
        departure: '06:10 AM',
        arrival: '08:45 AM',
        duration: '2h 35m',
        price_inr: 5120,
        formatted_price: '₹5,120',
        badge: 'Best',
        origin: 'BLR',
        destination: 'JAI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Jaipur (JAI)',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-jai-02',
        airline: 'Air India Express',
        flight_number: 'IX-772',
        departure: '09:20 AM',
        arrival: '12:00 PM',
        duration: '2h 40m',
        price_inr: 4650,
        formatted_price: '₹4,650',
        badge: 'Cheapest',
        origin: 'BLR',
        destination: 'JAI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Jaipur (JAI)',
        stops: 'Non-stop',
        cabin: 'Economy'
      },
      {
        id: 'flt-blr-jai-03',
        airline: 'Air India',
        flight_number: 'AI-840',
        departure: '05:30 AM',
        arrival: '07:55 AM',
        duration: '2h 25m',
        price_inr: 5900,
        formatted_price: '₹5,900',
        badge: 'Fastest',
        origin: 'BLR',
        destination: 'JAI',
        origin_city: 'Bengaluru (BLR)',
        destination_city: 'Jaipur (JAI)',
        stops: 'Non-stop',
        cabin: 'Economy Flex'
      }
    ]
  },
  hotels: {
    Munnar: [
      {
        id: 'hot-munnar-01',
        name: 'Fragrant Nature Munnar Luxury Retreat',
        location: 'Pothamedu Viewpoint Ridge, Munnar',
        rating: 4.8,
        reviews_count: 940,
        price_per_night_inr: 5800,
        total_price_inr: 11600,
        nights: 2,
        amenities: ['Free WiFi', 'Breakfast Included', 'Tea Valley Spa', 'Heated Fireplace'],
        badge: 'Best',
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '4.2 km from Munnar Town'
      },
      {
        id: 'hot-munnar-02',
        name: 'The Tall Trees Eco Resort & Canopy Walk',
        location: 'Bison Valley Road, Pothamedu',
        rating: 4.7,
        reviews_count: 620,
        price_per_night_inr: 4200,
        total_price_inr: 8400,
        nights: 2,
        amenities: ['Free WiFi', 'Breakfast Included', 'Forest Trail', 'Organic Café'],
        badge: 'Cheapest',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '5.8 km from Munnar Town'
      },
      {
        id: 'hot-munnar-03',
        name: 'Elixir Hills Suites & Ayurvedic Spa',
        location: 'Near Letchmi Tea Estate, Munnar',
        rating: 4.9,
        reviews_count: 1150,
        price_per_night_inr: 7200,
        total_price_inr: 14400,
        nights: 2,
        amenities: ['Free WiFi', 'Infinity Pool', 'Spa & Wellness', 'Valet Parking'],
        badge: 'Top Pick',
        image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '7.1 km from Munnar Town'
      }
    ],
    Goa: [
      {
        id: 'hot-goa-01',
        name: 'Ahilya by the Sea Heritage Villa',
        location: 'Dolphin Bay, Nerul, North Goa',
        rating: 4.9,
        reviews_count: 530,
        price_per_night_inr: 6500,
        total_price_inr: 13000,
        nights: 2,
        amenities: ['Free WiFi', 'Breakfast Included', 'Sea View', 'Plunge Pool'],
        badge: 'Best',
        image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '200m from Nerul Beach'
      },
      {
        id: 'hot-goa-02',
        name: 'Santana Beach Resort Boutique',
        location: 'Candolim Coastline, North Goa',
        rating: 4.6,
        reviews_count: 820,
        price_per_night_inr: 3600,
        total_price_inr: 7200,
        nights: 2,
        amenities: ['Free WiFi', 'Breakfast Included', 'Direct Beach Access', 'Bar & Bistro'],
        badge: 'Cheapest',
        image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '100m from Candolim Beach'
      },
      {
        id: 'hot-goa-03',
        name: 'W Goa Tropical Beachfront Haven',
        location: 'Vagator Beach, North Goa',
        rating: 4.8,
        reviews_count: 1400,
        price_per_night_inr: 8900,
        total_price_inr: 17800,
        nights: 2,
        amenities: ['Free WiFi', 'Rock Pool', 'Spa by Clarins', 'Private Beach Access'],
        badge: 'Top Pick',
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        distance_to_center: 'Facing Vagator Cliffs'
      }
    ],
    Jaipur: [
      {
        id: 'hot-jaipur-01',
        name: 'Shahpura House Heritage Haveli',
        location: 'Devi Marg, Bani Park, Jaipur',
        rating: 4.8,
        reviews_count: 1120,
        price_per_night_inr: 4900,
        total_price_inr: 9800,
        nights: 2,
        amenities: ['Free WiFi', 'Rooftop Dining', 'Royal Courtyard Pool', 'Rajasthani Breakfast'],
        badge: 'Best',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '2.5 km from City Palace'
      },
      {
        id: 'hot-jaipur-02',
        name: 'Umaid Bhawan Heritage Home',
        location: 'Behari Marg, Bani Park',
        rating: 4.6,
        reviews_count: 780,
        price_per_night_inr: 3200,
        total_price_inr: 6400,
        nights: 2,
        amenities: ['Free WiFi', 'Breakfast Included', 'Frescoed Lounge', 'Airport Transfer'],
        badge: 'Cheapest',
        image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '3.0 km from Old City'
      },
      {
        id: 'hot-jaipur-03',
        name: 'Samode Haveli Royal Residence',
        location: 'Gangapole, Old City, Jaipur',
        rating: 4.9,
        reviews_count: 890,
        price_per_night_inr: 8500,
        total_price_inr: 17000,
        nights: 2,
        amenities: ['Free WiFi', 'Historic Spa', 'Jacuzzi Courtyard', 'Royal High Tea'],
        badge: 'Top Pick',
        image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        distance_to_center: '800m from Hawa Mahal'
      }
    ]
  }
});

// Deterministic heuristic intent extractor for fallback
function extractIntentHeuristically(prompt: string) {
  const p = prompt.toLowerCase();

  let destination = 'Munnar';
  if (p.includes('goa')) destination = 'Goa';
  else if (p.includes('jaipur') || p.includes('rajasthan')) destination = 'Jaipur';
  else if (p.includes('manali') || p.includes('himachal')) destination = 'Manali';
  else if (p.includes('kerala') || p.includes('munnar') || p.includes('kochi')) destination = 'Munnar';

  let duration_days = 3;
  const daysMatch = prompt.match(/(\d+)\s*(?:day|days|d|nights|night)/i);
  if (daysMatch) {
    duration_days = Math.min(10, Math.max(1, parseInt(daysMatch[1], 10)));
  } else if (p.includes('weekend')) {
    duration_days = 2;
  }

  let budget_total_inr = 30000;
  const budgetMatch = prompt.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:,\d{3})+|\d+)(?:\s*(?:k|thousand|lakh|lac))?/i);
  if (budgetMatch) {
    let rawNum = budgetMatch[1].replace(/,/g, '');
    let val = parseInt(rawNum, 10);
    if (p.includes('k') || p.includes('thousand')) val *= 1000;
    if (p.includes('lakh') || p.includes('lac')) val *= 100000;
    if (val >= 3000 && val <= 500000) budget_total_inr = val;
  }

  const interests: string[] = [];
  if (p.includes('trek') || p.includes('hike') || p.includes('mountain')) interests.push('Mountain Treks');
  if (p.includes('tea') || p.includes('plantation') || p.includes('estate')) interests.push('Tea Plantations');
  if (p.includes('heritage') || p.includes('palace') || p.includes('fort')) interests.push('Heritage');
  if (p.includes('beach') || p.includes('sea') || p.includes('coastal')) interests.push('Beaches');
  if (p.includes('food') || p.includes('culinary') || p.includes('spice')) interests.push('Food & Spice');
  if (interests.length === 0) {
    if (destination === 'Munnar') interests.push('Mountain Treks', 'Tea Plantations');
    else if (destination === 'Goa') interests.push('Beaches', 'Heritage');
    else interests.push('Heritage', 'Food & Spice');
  }

  return {
    destination,
    origin: 'BLR',
    duration_days,
    start_date: null,
    end_date: null,
    budget_total_inr,
    travellers: 2,
    interests,
    travel_pace: 'balanced' as const,
    missing_fields: ['origin', 'travel_dates'],
    assumptions: ['Default departure from nearest major hub (BLR)', 'Economy airfare basis', 'Double occupancy']
  };
}

// Route 1: POST /api/parse-intent
app.post('/api/parse-intent', async (req: Request, res: Response) => {
  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ status: 'error', message: 'Valid prompt string is required' });
    return;
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const isInvalidOrPlaceholder = !geminiKey || geminiKey === 'MY_GEMINI_API_KEY' || geminiKey.trim() === '' || geminiKey.includes('placeholder');
  const useMock = process.env.USE_MOCK_DATA === 'true' || isInvalidOrPlaceholder;

  if (!useMock && geminiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Parse this travel intent for an India trip planner: "${prompt}". Return structured JSON matching the schema.`,
        config: {
          systemInstruction: 'You are BEEMVOYG AI, a precise India travel intent extractor. Normalize Indian destinations (e.g. Munnar, Goa, Jaipur). Default origin to BLR if unspecified.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING, description: 'Destination city in India' },
              origin: { type: Type.STRING, description: 'Origin city or IATA airport code, default BLR' },
              duration_days: { type: Type.INTEGER, description: 'Duration of trip in days' },
              budget_total_inr: { type: Type.INTEGER, description: 'Total trip budget in Indian Rupees (INR)' },
              travellers: { type: Type.INTEGER, description: 'Number of travellers' },
              interests: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of travel interests or themes'
              },
              travel_pace: {
                type: Type.STRING,
                description: 'Travel pacing: relaxed, balanced, or fast-paced'
              },
              missing_fields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Fields not specified by the user'
              },
              assumptions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Assumptions made during synthesis'
              }
            },
            required: ['destination', 'duration_days', 'budget_total_inr']
          }
        }
      });

      const responseText = response.text ? response.text.trim() : '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.json({
          status: 'success',
          source: 'gemini-3.8-flash',
          intent: {
            destination: parsed.destination || 'Munnar',
            origin: parsed.origin || 'BLR',
            duration_days: parsed.duration_days || 3,
            start_date: null,
            end_date: null,
            budget_total_inr: parsed.budget_total_inr || 30000,
            travellers: parsed.travellers || 2,
            interests: parsed.interests || ['Mountain Treks', 'Tea Plantations'],
            travel_pace: parsed.travel_pace || 'balanced',
            missing_fields: parsed.missing_fields || ['origin', 'travel_dates'],
            assumptions: parsed.assumptions || ['Default departure from BLR', 'Economy airfare basis']
          }
        });
        return;
      }
    } catch (err) {
      console.warn('Gemini intent extraction error, falling back to heuristic engine:', err);
    }
  }

  // Fallback heuristic extraction
  const intent = extractIntentHeuristically(prompt);
  res.json({
    status: 'success',
    source: 'heuristic-engine',
    intent
  });
});

// Route 2: POST /api/search (Flights, Hotels, Local)
app.post('/api/search', async (req: Request, res: Response) => {
  const { type = 'flights', destination = 'Munnar' } = req.body || {};

  const normDest = String(destination).toLowerCase().includes('goa')
    ? 'Goa'
    : String(destination).toLowerCase().includes('jaipur')
    ? 'Jaipur'
    : 'Munnar';

  const serpApiKey = process.env.SERPAPI_API_KEY;
  const isInvalidSerpKey = !serpApiKey || serpApiKey === 'MY_SERPAPI_API_KEY' || serpApiKey.trim() === '' || serpApiKey.includes('placeholder');
  const useMock = process.env.USE_MOCK_DATA === 'true' || isInvalidSerpKey;

  if (!useMock && serpApiKey) {
    try {
      let serpEngine = 'google_flights';
      if (type === 'hotels') serpEngine = 'google_hotels';
      else if (type === 'local' || type === 'activities') serpEngine = 'google_local';

      const searchUrl = new URL('https://serpapi.com/search.json');
      searchUrl.searchParams.set('engine', serpEngine);
      searchUrl.searchParams.set('api_key', serpApiKey);
      searchUrl.searchParams.set('q', `${normDest} travel`);

      const serpRes = await fetch(searchUrl.toString(), {
        headers: { 'User-Agent': 'BeemvoyApp/1.0' }
      });

      if (serpRes.ok) {
        const liveData = await serpRes.json();
        // Sanitize: strip tokens and internal params
        delete liveData.search_metadata;
        delete liveData.search_parameters;
        res.json({
          status: 'success',
          source: 'serpapi-live',
          category: type,
          results: liveData.best_flights || liveData.properties || liveData.local_results || []
        });
        return;
      }
    } catch (err) {
      console.warn('SerpApi live search error, falling back to mock:', err);
    }
  }

  // Defensive cloning of frozen mock dataset
  let dataset: unknown[] = [];
  if (type === 'hotels') {
    const raw = (FROZEN_MOCK_DATA.hotels as Record<string, unknown[]>)[normDest] || FROZEN_MOCK_DATA.hotels.Munnar;
    dataset = structuredClone(raw);
  } else {
    const raw = (FROZEN_MOCK_DATA.flights as Record<string, unknown[]>)[normDest] || FROZEN_MOCK_DATA.flights.Munnar;
    dataset = structuredClone(raw);
  }

  res.json({
    status: 'success',
    source: 'stateless-cloned-mock',
    category: type,
    destination: normDest,
    results: dataset
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BEEMVOYG Server active on http://0.0.0.0:${PORT} [${isProduction ? 'prod' : 'dev'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BEEMVOY server:', err);
  process.exit(1);
});
