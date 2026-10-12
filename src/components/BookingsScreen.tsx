import React, { useState, useEffect } from 'react';
import { Plane, Building2, Check, ArrowRight, Star, MapPin } from 'lucide-react';
import { TripFlight, TripHotel, RankingBadge } from '../types/trip';
import { MOCK_FLIGHTS_DATA, MOCK_HOTELS_DATA } from '../lib/mockData';

interface BookingsScreenProps {
  destination: string;
  nightsCount: number;
  selectedFlight: TripFlight | null;
  selectedHotel: TripHotel | null;
  onSelectFlight: (flight: TripFlight) => void;
  onSelectHotel: (hotel: TripHotel) => void;
  onProceedToExplore: () => void;
  initialSubTab?: 'flights' | 'hotels';
}

export const BookingsScreen: React.FC<BookingsScreenProps> = ({
  destination,
  nightsCount,
  selectedFlight,
  selectedHotel,
  onSelectFlight,
  onSelectHotel,
  onProceedToExplore,
  initialSubTab = 'flights'
}) => {
  const [subTab, setSubTab] = useState<'flights' | 'hotels'>(initialSubTab);

  // Flights state
  const [flightFilter, setFlightFilter] = useState<'all' | 'Cheapest' | 'Fastest'>('all');
  const [flights, setFlights] = useState<TripFlight[]>([]);
  const [isFlightsLoading, setIsFlightsLoading] = useState(true);

  // Hotels state
  const [amenityFilter, setAmenityFilter] = useState<string>('All');
  const [hotels, setHotels] = useState<TripHotel[]>([]);
  const [isHotelsLoading, setIsHotelsLoading] = useState(true);

  const amenitiesList = ['All', 'Breakfast Included', 'Free WiFi', 'Spa', 'Pool'];

  useEffect(() => {
    let isMounted = true;
    setIsFlightsLoading(true);

    const fetchFlights = async () => {
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'flights', destination })
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.results) && data.results.length > 0) {
            setFlights(data.results);
            setIsFlightsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Flight fetch failed, using mock:', err);
      }
      if (isMounted) {
        setFlights(MOCK_FLIGHTS_DATA[destination] || MOCK_FLIGHTS_DATA['Munnar']);
        setIsFlightsLoading(false);
      }
    };

    fetchFlights();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  useEffect(() => {
    let isMounted = true;
    setIsHotelsLoading(true);

    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'hotels', destination })
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.results) && data.results.length > 0) {
            setHotels(data.results);
            setIsHotelsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Hotel fetch failed, using mock:', err);
      }
      if (isMounted) {
        setHotels(MOCK_HOTELS_DATA[destination] || MOCK_HOTELS_DATA['Munnar']);
        setIsHotelsLoading(false);
      }
    };

    fetchHotels();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  const filteredFlights = flights.filter(f => {
    if (flightFilter === 'all') return true;
    return f.badge === flightFilter;
  });

  const filteredHotels = hotels.filter(h => {
    if (amenityFilter === 'All') return true;
    return h.amenities.some(a => a.toLowerCase().includes(amenityFilter.toLowerCase()));
  });

  const getBadgeStyle = (badge: RankingBadge) => {
    switch (badge) {
      case 'Best':
        return 'bg-purple-950/80 text-purple-300 border border-purple-700/60';
      case 'Cheapest':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
      case 'Fastest':
        return 'bg-blue-950/80 text-blue-300 border border-blue-700/60';
      case 'Top Pick':
        return 'bg-amber-950/80 text-amber-300 border border-amber-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const totalLogisticsCost =
    (selectedFlight?.price_inr || 0) + (selectedHotel?.total_price_inr || 0);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Flights & Stays
          </h1>
          <span className="text-[11px] text-purple-400">
            {destination} · Complete Travel Logistics
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block">Committed:</span>
          <span className="text-xs font-bold text-purple-400">
            ₹{totalLogisticsCost.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Merged Navigation Sub-Segments */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-3.5">
        <button
          type="button"
          onClick={() => setSubTab('flights')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            subTab === 'flights'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Flights</span>
          {selectedFlight && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setSubTab('hotels')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            subTab === 'hotels'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hotels ({nightsCount}N)</span>
          {selectedHotel && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
          )}
        </button>
      </div>

      {/* FLIGHTS SUB-VIEW */}
      {subTab === 'flights' && (
        <div className="space-y-3 flex-1">
          {/* Flight Filters */}
          <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-slate-800 mb-1">
            {(['all', 'Cheapest', 'Fastest'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFlightFilter(mode)}
                className={`flex-1 py-1 text-[11px] font-medium rounded-lg transition-all capitalize active:scale-95 ${
                  flightFilter === mode
                    ? 'bg-purple-900/70 text-purple-200 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'all' ? 'All Flights' : mode}
              </button>
            ))}
          </div>

          {isFlightsLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-28 mb-3" />
                <div className="h-6 bg-slate-800 rounded w-full" />
              </div>
            ))
          ) : (
            filteredFlights.map((flight) => {
              const isSelected = selectedFlight?.id === flight.id;
              return (
                <div
                  key={flight.id}
                  onClick={() => onSelectFlight(flight)}
                  className={`bg-slate-900 rounded-2xl p-3.5 border transition-all duration-150 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{flight.airline}</span>
                      <span className="text-[10px] text-slate-400">({flight.flight_number})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${getBadgeStyle(flight.badge)}`}>
                        {flight.badge}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'border-slate-700 text-transparent'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-white block">{flight.departure}</span>
                      <span className="text-[10px] text-slate-400">{flight.origin}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-400 mb-0.5">{flight.duration}</span>
                      <div className="flex items-center gap-1 w-20">
                        <div className="h-[1px] bg-slate-700 flex-1" />
                        <Plane className="w-3 h-3 text-purple-400" />
                        <div className="h-[1px] bg-slate-700 flex-1" />
                      </div>
                      <span className="text-[9px] text-emerald-400 mt-0.5">{flight.stops}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">{flight.arrival}</span>
                      <span className="text-[10px] text-slate-400">{flight.destination}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{flight.cabin}</span>
                    <span className="text-xs font-bold text-purple-400">{flight.formatted_price} / traveler</span>
                  </div>
                </div>
              );
            })
          )}

          <button
            type="button"
            onClick={() => setSubTab('hotels')}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span>Next: Choose Accommodations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* HOTELS SUB-VIEW */}
      {subTab === 'hotels' && (
        <div className="space-y-3.5 flex-1">
          {/* Amenity Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {amenitiesList.map((item) => (
              <button
                key={item}
                onClick={() => setAmenityFilter(item)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all active:scale-95 ${
                  amenityFilter === item
                    ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {isHotelsLoading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 animate-pulse">
                <div className="h-24 bg-slate-800 rounded-xl mb-2" />
                <div className="h-4 bg-slate-800 rounded w-36" />
              </div>
            ))
          ) : (
            filteredHotels.map((hotel) => {
              const isSelected = selectedHotel?.id === hotel.id;
              return (
                <div
                  key={hotel.id}
                  onClick={() => onSelectHotel(hotel)}
                  className={`bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-150 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="relative h-28 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(hotel.badge)}`}>
                        {hotel.badge}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shadow-md ${
                          isSelected
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-black/40 border-white/40 text-transparent'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[11px] text-white">
                      <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="font-bold">{hotel.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-300 bg-black/50 px-1.5 py-0.5 rounded truncate max-w-[170px]">
                        {hotel.distance_to_center}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-bold text-white mb-0.5 truncate">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate">{hotel.location}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Nightly rate:</span>
                        <span className="text-xs font-semibold text-slate-300">
                          ₹{hotel.price_per_night_inr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-right bg-purple-950/60 border border-purple-800/50 px-2 py-0.5 rounded-lg">
                        <span className="text-[9px] text-purple-300 block">Total ({nightsCount} nights):</span>
                        <span className="text-xs font-extrabold text-purple-400">
                          ₹{(hotel.price_per_night_inr * nightsCount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <button
            type="button"
            onClick={onProceedToExplore}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Proceed to Explore Activities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
