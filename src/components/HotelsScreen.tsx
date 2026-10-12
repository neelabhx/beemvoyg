import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Star, MapPin, Wifi, Coffee, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { TripHotel, RankingBadge } from '../types/trip';
import { MOCK_HOTELS_DATA } from '../lib/mockData';

interface HotelsScreenProps {
  destination: string;
  nightsCount: number;
  selectedHotel: TripHotel | null;
  onSelectHotel: (hotel: TripHotel) => void;
  onContinueToActivities: () => void;
  onBack: () => void;
}

export const HotelsScreen: React.FC<HotelsScreenProps> = ({
  destination,
  nightsCount,
  selectedHotel,
  onSelectHotel,
  onContinueToActivities,
  onBack
}) => {
  const [amenityFilter, setAmenityFilter] = useState<string>('All');
  const [hotels, setHotels] = useState<TripHotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const amenitiesList = ['All', 'Breakfast Included', 'Free WiFi', 'Spa', 'Pool'];

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

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
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Live hotel search failed, falling back to dataset:', err);
      }

      if (isMounted) {
        const fallback = MOCK_HOTELS_DATA[destination] || MOCK_HOTELS_DATA['Munnar'];
        setHotels(fallback);
        setIsLoading(false);
      }
    };

    fetchHotels();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  const filteredHotels = hotels.filter((h) => {
    if (amenityFilter === 'All') return true;
    return h.amenities.some((a) => a.toLowerCase().includes(amenityFilter.toLowerCase()));
  });

  const getBadgeStyle = (badge: RankingBadge) => {
    switch (badge) {
      case 'Best':
        return 'bg-purple-950/80 text-purple-300 border border-purple-700/60';
      case 'Cheapest':
        return 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60';
      case 'Top Pick':
        return 'bg-amber-950/80 text-amber-300 border border-amber-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Destination & Stay Header */}
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
              Curate Hotels (HOT-01)
            </h1>
            <span className="text-[11px] text-purple-400">
              {destination} · {nightsCount} Nights Stay
            </span>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
          Verified Curation
        </div>
      </div>

      {/* Amenity Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {amenitiesList.map((item) => (
          <button
            key={item}
            onClick={() => setAmenityFilter(item)}
            className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all active:scale-95 ${
              amenityFilter === item
                ? 'bg-purple-600 text-white border-purple-500 font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Hotel Cards List */}
      <div className="space-y-3.5 flex-1">
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 animate-pulse">
              <div className="h-28 bg-slate-800 rounded-xl mb-3" />
              <div className="h-4 bg-slate-800 rounded w-40 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-24" />
            </div>
          ))
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No accommodations match this amenity filter.
          </div>
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
                {/* Photo Thumbnail */}
                <div className="relative h-32 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                  
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(hotel.badge)}`}>
                      {hotel.badge}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors shadow-md ${
                        isSelected
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-black/40 border-white/40 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-xs text-white">
                    <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold">{hotel.rating}</span>
                      <span className="text-[10px] text-slate-300">({hotel.reviews_count})</span>
                    </div>
                    <span className="text-[10px] text-slate-300 bg-black/50 px-2 py-0.5 rounded-md">
                      {hotel.distance_to_center}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-3.5">
                  <h3 className="text-xs font-bold text-white mb-1 tracking-tight">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-2">
                    <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">{hotel.location}</span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.map((a, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* Price Differentiation container */}
                  <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nightly rate:</span>
                      <span className="text-xs font-semibold text-slate-300">
                        ₹{hotel.price_per_night_inr.toLocaleString('en-IN')} / night
                      </span>
                    </div>

                    {/* Total Trip Pricing Container */}
                    <div className="text-right bg-purple-950/50 border border-purple-800/50 px-2.5 py-1 rounded-xl">
                      <span className="text-[10px] text-purple-300 block font-medium">Total Stay ({nightsCount} nights):</span>
                      <span className="text-sm font-extrabold text-purple-400">
                        ₹{(hotel.price_per_night_inr * nightsCount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Continue */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={onContinueToActivities}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>Continue to Itinerary & Activities</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
