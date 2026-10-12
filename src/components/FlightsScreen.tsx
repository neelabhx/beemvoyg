import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Plane, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { TripFlight, RankingBadge } from '../types/trip';
import { MOCK_FLIGHTS_DATA } from '../lib/mockData';

interface FlightsScreenProps {
  destination: string;
  selectedFlight: TripFlight | null;
  onSelectFlight: (flight: TripFlight) => void;
  onContinueToHotels: () => void;
  onBack: () => void;
}

export const FlightsScreen: React.FC<FlightsScreenProps> = ({
  destination,
  selectedFlight,
  onSelectFlight,
  onContinueToHotels,
  onBack
}) => {
  const [filter, setFilter] = useState<'all' | 'Cheapest' | 'Fastest'>('all');
  const [flights, setFlights] = useState<TripFlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

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
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Live flight search failed, utilizing fallback dataset:', err);
      }

      if (isMounted) {
        const fallback = MOCK_FLIGHTS_DATA[destination] || MOCK_FLIGHTS_DATA['Munnar'];
        setFlights(fallback);
        setIsLoading(false);
      }
    };

    fetchFlights();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  const filteredFlights = flights.filter(f => {
    if (filter === 'all') return true;
    return f.badge === filter;
  });

  const getBadgeStyle = (badge: RankingBadge) => {
    switch (badge) {
      case 'Best':
        return 'bg-purple-950/80 text-purple-300 border border-purple-700/60';
      case 'Cheapest':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
      case 'Fastest':
        return 'bg-blue-950/80 text-blue-300 border border-blue-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Route Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Curate Flights (FLT-01)
            </h1>
            <span className="text-[11px] text-purple-400">
              BLR → {destination === 'Munnar' ? 'COK (Kochi)' : destination === 'Goa' ? 'GOI (Goa)' : 'JAI (Jaipur)'}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
          Non-stop Domestic
        </div>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 mb-4">
        {(['all', 'Cheapest', 'Fastest'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all capitalize active:scale-95 ${
              filter === mode
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mode === 'all' ? 'All Curated' : mode}
          </button>
        ))}
      </div>

      {/* Flight Cards List */}
      <div className="space-y-3 flex-1">
        {isLoading ? (
          /* Skeletons */
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 animate-pulse">
              <div className="flex justify-between items-center mb-3">
                <div className="h-4 bg-slate-800 rounded w-24" />
                <div className="h-4 bg-slate-800 rounded w-16" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-slate-800 rounded w-20" />
                <div className="h-6 bg-slate-800 rounded w-16" />
                <div className="h-6 bg-slate-800 rounded w-20" />
              </div>
            </div>
          ))
        ) : filteredFlights.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No flights matching this filter.
          </div>
        ) : (
          filteredFlights.map((flight) => {
            const isSelected = selectedFlight?.id === flight.id;
            return (
              <div
                key={flight.id}
                onClick={() => onSelectFlight(flight)}
                className={`bg-slate-900 rounded-2xl p-4 border transition-all duration-150 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/50'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{flight.airline}</span>
                    <span className="text-[10px] text-slate-400">({flight.flight_number})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getBadgeStyle(flight.badge)}`}>
                      {flight.badge}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-bold text-white block">{flight.departure}</span>
                    <span className="text-[10px] text-slate-400">{flight.origin}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 mb-0.5">{flight.duration}</span>
                    <div className="flex items-center gap-1 w-24">
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
                  <span className="text-[10px] text-slate-400">{flight.cabin} · 15kg Baggage</span>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-purple-400">{flight.formatted_price}</span>
                    <span className="text-[9px] text-slate-500 block">per passenger</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Action */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={onContinueToHotels}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue to Hotels (HOT-01)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
