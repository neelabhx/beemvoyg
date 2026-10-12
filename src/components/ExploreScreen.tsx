import React, { useState } from 'react';
import { Compass, Clock, Star, Plus, Check, ArrowRight, ShieldCheck, MapPin, Info } from 'lucide-react';
import { TripActivity } from '../types/trip';
import { MOCK_ACTIVITIES_DATA } from '../lib/mockData';

interface ExploreScreenProps {
  destination: string;
  selectedActivities: TripActivity[];
  onToggleActivity: (activity: TripActivity) => void;
  onViewItinerary: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  destination,
  selectedActivities,
  onToggleActivity,
  onViewItinerary
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Trek', 'Estate', 'Heritage', 'Culinary', 'Nature', 'Culture'];

  const allActivities = MOCK_ACTIVITIES_DATA[destination] || MOCK_ACTIVITIES_DATA['Munnar'];

  const filtered = allActivities.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const totalAddedCount = selectedActivities.length;
  const totalAddedCost = selectedActivities.reduce((sum, a) => sum + a.price_per_person_inr, 0);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Discover Activities
          </h1>
          <span className="text-[11px] text-purple-400">
            Curated Local Experiences in {destination}
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
          <Compass className="w-4 h-4" />
        </div>
      </div>

      {/* Horizontal Category Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === cat
                ? 'bg-purple-600 text-white border-purple-500 font-semibold shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="space-y-4 flex-1">
        {filtered.map((activity) => {
          const isAdded = selectedActivities.some((a) => a.id === activity.id);
          return (
            <div
              key={activity.id}
              className={`bg-slate-900 rounded-2xl overflow-hidden border transition-all duration-150 ${
                isAdded ? 'border-purple-500/80 ring-1 ring-purple-500/40' : 'border-slate-800'
              }`}
            >
              {/* Photo Thumbnail */}
              <div className="relative h-28 w-full bg-slate-800 overflow-hidden">
                <img
                  src={activity.image_url}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 text-purple-300 border border-purple-500/30 backdrop-blur-xs">
                    {activity.category}
                  </span>
                </div>

                <div className="absolute bottom-2 left-2.5 flex items-center gap-2 text-xs text-white">
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{activity.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[10px] text-slate-300">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{activity.duration}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3.5">
                <h3 className="text-xs font-bold text-white mb-1 tracking-tight">
                  {activity.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                  {activity.description}
                </p>

                {/* Practical Logistics Field Note */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 mb-3 flex items-start gap-1.5 text-[10px] text-slate-400">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{activity.logistics_note}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Per person</span>
                    <span className="text-xs font-bold text-purple-400">
                      ₹{activity.price_per_person_inr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleActivity(activity)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
                      isAdded
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Trip</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Summary Drawer */}
      {totalAddedCount > 0 && (
        <div className="mt-4 p-3 bg-purple-950/90 border border-purple-600/60 rounded-2xl shadow-xl flex items-center justify-between backdrop-blur-md">
          <div>
            <span className="text-xs font-bold text-white block">
              {totalAddedCount} {totalAddedCount === 1 ? 'Activity' : 'Activities'} Selected
            </span>
            <span className="text-[10px] text-purple-300">
              ₹{totalAddedCost.toLocaleString('en-IN')} total / person
            </span>
          </div>

          <button
            onClick={onViewItinerary}
            className="py-2 px-3 bg-white hover:bg-slate-100 text-purple-950 text-xs font-bold rounded-xl flex items-center gap-1 shadow-md active:scale-95 transition-all"
          >
            <span>View Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
