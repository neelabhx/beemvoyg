import React from 'react';
import { Calendar, MapPin, Clock, CheckCircle2, Circle, Plane, Building2, Compass, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { CanonicalTrip, ItineraryWaypoint } from '../types/trip';

interface ItineraryScreenProps {
  canonicalTrip: CanonicalTrip;
  onToggleVisited: (dayIndex: number, waypointId: string) => void;
  onOpenExplore: () => void;
  onProceedToLedger: () => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  canonicalTrip,
  onToggleVisited,
  onOpenExplore,
  onProceedToLedger
}) => {
  const getWaypointIcon = (type: ItineraryWaypoint['type']) => {
    switch (type) {
      case 'flight':
        return <Plane className="w-3.5 h-3.5 text-purple-400" />;
      case 'hotel':
        return <Building2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'activity':
        return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
      case 'meal':
        return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Trip Overview Banner */}
      <div className="bg-gradient-to-br from-purple-900/60 to-slate-900 rounded-3xl p-4 border border-purple-800/40 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-700/50">
            Interactive Day-by-Day Timeline (ITN-01)
          </span>
          <span className="text-xs font-semibold text-white">
            {canonicalTrip.days} Days
          </span>
        </div>

        <h1 className="text-lg font-bold text-white tracking-tight mb-1">
          {canonicalTrip.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-300 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{canonicalTrip.dates}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            <span>{canonicalTrip.destination}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-purple-800/40 flex items-center justify-between">
          <span>Flight & Accommodations Synced</span>
          <span className="font-semibold text-purple-300">
            Target: ₹{canonicalTrip.budget_total_inr.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Days Loop */}
      <div className="space-y-6 flex-1">
        {canonicalTrip.itinerary_days.map((dayPlan, dayIndex) => (
          <div key={dayPlan.day} className="relative">
            {/* Day Header Banner */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3.5 py-2.5 rounded-2xl mb-3 shadow-md">
              <div>
                <span className="text-xs font-bold text-white block">
                  Day {dayPlan.day} of {canonicalTrip.days}
                </span>
                <span className="text-[11px] text-purple-400 font-medium">
                  {dayPlan.theme}
                </span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium">
                {dayPlan.waypoints.length} Stops
              </span>
            </div>

            {/* Vertical Connector Path */}
            <div className="relative pl-6">
              {/* Continuous vertical connector line */}
              <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500/70 to-slate-800" />

              <div className="space-y-4">
                {dayPlan.waypoints.map((wp) => (
                  <div key={wp.id} className="relative flex items-start group">
                    {/* Waypoint Circular Node with Visited Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleVisited(dayIndex, wp.id)}
                      className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center transition-all duration-150 z-10 active:scale-90 hover:border-purple-400 cursor-pointer"
                      title={wp.is_visited ? 'Mark unvisited' : 'Mark as visited'}
                    >
                      {wp.is_visited ? (
                        <CheckCircle2 className="w-5 h-5 text-purple-400 fill-purple-950" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>

                    {/* Waypoint Content Card */}
                    <div
                      className={`flex-1 bg-slate-900/80 rounded-2xl p-3.5 border transition-all duration-150 ${
                        wp.is_visited
                          ? 'border-purple-800/60 bg-purple-950/15'
                          : 'border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="p-1 rounded-md bg-slate-800 border border-slate-700/60">
                            {getWaypointIcon(wp.type)}
                          </span>
                          <span className="text-[10px] font-bold text-purple-300 tracking-wider uppercase">
                            {wp.time}
                          </span>
                        </div>
                        {wp.cost_inr > 0 && (
                          <span className="text-[10px] font-semibold text-slate-400">
                            ₹{wp.cost_inr.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-xs font-bold transition-colors ${
                          wp.is_visited ? 'text-slate-200 line-through opacity-80' : 'text-white'
                        }`}
                      >
                        {wp.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {wp.subtitle}
                      </p>

                      {wp.logistics_note && (
                        <div className="mt-2 text-[10px] text-slate-400 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800/60">
                          {wp.logistics_note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Redirect Buttons */}
      <div className="mt-6 space-y-2 pt-3 border-t border-slate-800/80">
        <button
          onClick={onProceedToLedger}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
        >
          <span>Proceed to Booking & Ledger (TRAVEL-01)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenExplore}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>Explore & Add More Activities</span>
        </button>
      </div>
    </div>
  );
};
