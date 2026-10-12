import React, { useState } from 'react';
import { Sparkles, Plane, Building2, Calendar, MapPin, IndianRupee, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { UserProfile, CanonicalTrip } from '../types/trip';

interface HomeScreenProps {
  userProfile: UserProfile;
  canonicalTrip: CanonicalTrip;
  isSynthesizing: boolean;
  onSynthesizeIntent: (promptText: string) => Promise<void>;
  onOpenFlights: () => void;
  onOpenHotels: () => void;
  onOpenItinerary: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  canonicalTrip,
  isSynthesizing,
  onSynthesizeIntent,
  onOpenFlights,
  onOpenHotels,
  onOpenItinerary
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [synthesisNotification, setSynthesisNotification] = useState<string | null>(null);

  const quickPrompts = [
    '3 days in Munnar under ₹30,000',
    'Weekend in Goa under ₹15,000',
    '4 days royal heritage in Jaipur'
  ];

  const handlePromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim()) return;

    setSynthesisNotification(null);
    await onSynthesizeIntent(promptInput.trim());
    setSynthesisNotification(`Synthesized itinerary for ${canonicalTrip.destination}!`);
    setTimeout(() => setSynthesisNotification(null), 4000);
  };

  const handleQuickPromptClick = (text: string) => {
    setPromptInput(text);
    onSynthesizeIntent(text);
  };

  // Calculate live budget consumption
  const flightCost = canonicalTrip.selected_flight?.price_inr || 0;
  const hotelCost = canonicalTrip.selected_hotel?.total_price_inr || 0;
  const activitiesCost = canonicalTrip.selected_activities.reduce(
    (sum, a) => sum + a.price_per_person_inr * (canonicalTrip.travellers || 1),
    0
  );
  const totalAllocated = flightCost + hotelCost + activitiesCost;
  const budgetRatio = Math.min(100, Math.round((totalAllocated / canonicalTrip.budget_total_inr) * 100));

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Header Profile Greeting */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] text-purple-400 font-medium uppercase tracking-wider block">
            {userProfile.membership_tier}
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Welcome back, {userProfile.name.split(' ')[0]}
          </h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-400/40 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-purple-500/20">
          {userProfile.name.charAt(0)}
        </div>
      </div>

      {/* Synthesis Success Toast */}
      {synthesisNotification && (
        <div className="mb-3 p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{synthesisNotification}</span>
        </div>
      )}

      {/* Active Trip Status Card with Live Budget Meter */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Curation
            </span>
          </div>
          <span className="text-[11px] font-medium text-purple-400 bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded-full capitalize">
            {canonicalTrip.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
            {canonicalTrip.title}
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {canonicalTrip.days} Days
          </span>
        </div>

        <div className="text-[11px] text-slate-400 mb-3 flex items-center gap-3">
          <span>Route: {canonicalTrip.origin} → {canonicalTrip.destination}</span>
          <span>·</span>
          <span>{canonicalTrip.travellers} Travellers</span>
        </div>

        {/* Live Budget Meter */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Committed Spend</span>
            <div className="font-semibold text-white flex items-center">
              <span className="text-purple-400 font-bold">₹{totalAllocated.toLocaleString('en-IN')}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">₹{canonicalTrip.budget_total_inr.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                budgetRatio > 90
                  ? 'bg-rose-500'
                  : budgetRatio > 70
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(8, budgetRatio))}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{budgetRatio}% of target budget used</span>
            <span>₹{(canonicalTrip.budget_total_inr - totalAllocated).toLocaleString('en-IN')} remaining</span>
          </div>
        </div>
      </div>

      {/* Natural Language Prompt Synthesis Box */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4 relative">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Synthesize Trip from Intent</span>
        </div>

        <form onSubmit={handlePromptSubmit}>
          <div className="relative">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. 3 days in Munnar under ₹30,000 with tea estate treks"
              rows={2}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[10px] text-slate-500">
              Gemini 3.8 Flash + Heuristic Fallback
            </span>
            <button
              type="submit"
              disabled={isSynthesizing || !promptInput.trim()}
              className="py-2 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all duration-150 disabled:opacity-40 cursor-pointer"
            >
              {isSynthesizing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Synthesize</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Prompt Pills */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 block mb-1.5 font-medium">
            Try Quick Prompts:
          </span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickPromptClick(q)}
                disabled={isSynthesizing}
                className="text-left text-[11px] px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer truncate"
              >
                ✨ {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Shortcuts Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Curate Components
          </span>
          <button
            onClick={onOpenItinerary}
            className="text-[11px] text-purple-400 hover:underline flex items-center gap-0.5"
          >
            <span>View Itinerary</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Flight Card Shortcut */}
          <button
            type="button"
            onClick={onOpenFlights}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-600/50 text-left transition-all active:scale-95 shadow-sm group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <Plane className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white mb-0.5">Flights</div>
            <div className="text-[10px] text-slate-400 truncate">
              {canonicalTrip.selected_flight
                ? `${canonicalTrip.selected_flight.airline} · ${canonicalTrip.selected_flight.formatted_price}`
                : 'Select Best / Cheapest'}
            </div>
          </button>

          {/* Hotel Card Shortcut */}
          <button
            type="button"
            onClick={onOpenHotels}
            className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-600/50 text-left transition-all active:scale-95 shadow-sm group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white mb-0.5">Hotels</div>
            <div className="text-[10px] text-slate-400 truncate">
              {canonicalTrip.selected_hotel
                ? `${canonicalTrip.selected_hotel.name.split(' ')[0]} · ₹${canonicalTrip.selected_hotel.total_price_inr}`
                : 'Select Curated Stays'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
