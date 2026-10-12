import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Plane,
  Building2,
  Compass,
  Coffee,
  Wallet,
  Users,
  Share2,
  CreditCard,
  QrCode,
  Lock,
  Check,
  ArrowRight
} from 'lucide-react';
import { CanonicalTrip, ItineraryWaypoint } from '../types/trip';

interface TripScreenProps {
  canonicalTrip: CanonicalTrip;
  onToggleVisited: (dayIndex: number, waypointId: string) => void;
  onOpenExplore: () => void;
  onConfirmBooking: () => void;
  initialSubTab?: 'timeline' | 'split';
}

export const TripScreen: React.FC<TripScreenProps> = ({
  canonicalTrip,
  onToggleVisited,
  onOpenExplore,
  onConfirmBooking,
  initialSubTab = 'timeline'
}) => {
  const [subTab, setSubTab] = useState<'timeline' | 'split'>(initialSubTab);

  // Split ledger state
  const [companions, setCompanions] = useState<number>(canonicalTrip.travellers || 2);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [shareToast, setShareToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Financial calculations
  const flightCost = canonicalTrip.selected_flight?.price_inr
    ? canonicalTrip.selected_flight.price_inr * companions
    : 0;
  const hotelCost = canonicalTrip.selected_hotel?.total_price_inr || 0;
  const activitiesCost = canonicalTrip.selected_activities.reduce(
    (sum, a) => sum + a.price_per_person_inr * companions,
    0
  );
  const platformAssurance = 499;
  const estimatedLocalCab = 2200;
  const grandTotal = flightCost + hotelCost + activitiesCost + platformAssurance + estimatedLocalCab;
  const perPersonShare = Math.round(grandTotal / companions);

  const handleShareSplitLink = () => {
    setShareToast(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Hey! Check our ${canonicalTrip.destination} trip split on Beemvoyg: Grand Total ₹${grandTotal.toLocaleString('en-IN')}, your share is ₹${perPersonShare.toLocaleString('en-IN')}. Pay via UPI/Card!`
      );
    }
    setTimeout(() => setShareToast(false), 3000);
  };

  const handleSimulatedCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowReceiptModal(true);
      onConfirmBooking();
    }, 1200);
  };

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
      {/* Header Overview Banner */}
      <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-3xl p-4 border border-purple-800/40 shadow-xl mb-3.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-700/50">
            {canonicalTrip.status === 'booked' ? 'Booked Itinerary' : 'Active Curation'}
          </span>
          <span className="text-xs font-semibold text-white">
            {canonicalTrip.days} Days / {canonicalTrip.days - 1} Nights
          </span>
        </div>

        <h1 className="text-base font-bold text-white tracking-tight mb-1">
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
          <span>Target Budget: ₹{canonicalTrip.budget_total_inr.toLocaleString('en-IN')}</span>
          <span className="font-bold text-purple-300">
            Current Total: ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Merged Navigation Sub-Segments */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-3.5">
        <button
          type="button"
          onClick={() => setSubTab('timeline')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            subTab === 'timeline'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('split')}
          className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
            subTab === 'split'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Split & Pay</span>
        </button>
      </div>

      {/* TIMELINE SUB-VIEW */}
      {subTab === 'timeline' && (
        <div className="space-y-5 flex-1">
          {canonicalTrip.itinerary_days.map((dayPlan, dayIndex) => (
            <div key={dayPlan.day} className="relative">
              {/* Day Header Banner */}
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl mb-2.5 shadow-md">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Day {dayPlan.day} of {canonicalTrip.days}
                  </span>
                  <span className="text-[11px] text-purple-400 font-medium">
                    {dayPlan.theme}
                  </span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                  {dayPlan.waypoints.length} Stops
                </span>
              </div>

              {/* Vertical Connector Path */}
              <div className="relative pl-6">
                <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500/70 to-slate-800" />

                <div className="space-y-3.5">
                  {dayPlan.waypoints.map((wp) => (
                    <div key={wp.id} className="relative flex items-start group">
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

                      <div
                        className={`flex-1 bg-slate-900/80 rounded-2xl p-3 border transition-all duration-150 ${
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

          {/* Quick buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setSubTab('split')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              <span>Review Split & Checkout</span>
            </button>

            <button
              onClick={onOpenExplore}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Explore More Activities</span>
            </button>
          </div>
        </div>
      )}

      {/* SPLIT & PAY SUB-VIEW */}
      {subTab === 'split' && (
        <div className="space-y-3.5 flex-1">
          {shareToast && (
            <div className="p-2.5 rounded-xl bg-purple-950/90 border border-purple-500 text-purple-200 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Split link & tally copied to clipboard!</span>
            </div>
          )}

          {/* Itemized Ledger */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Itemized Breakdown
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {companions} Travelers
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="truncate pr-2">
                  Flights ({canonicalTrip.selected_flight?.airline || 'Domestic'} × {companions})
                </span>
                <span className="font-semibold text-white">₹{flightCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="truncate pr-2">
                  Hotel ({canonicalTrip.selected_hotel?.name.split(' ')[0] || 'Resort'}, {canonicalTrip.days - 1}N)
                </span>
                <span className="font-semibold text-white">₹{hotelCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="truncate pr-2">
                  Local Activities ({canonicalTrip.selected_activities.length} × {companions})
                </span>
                <span className="font-semibold text-white">₹{activitiesCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Estimated Local Transit</span>
                <span className="font-semibold text-white">₹{estimatedLocalCab.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Platform Assurance & GST</span>
                <span>₹{platformAssurance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-baseline justify-between">
              <span className="text-xs font-bold text-white uppercase">Grand Total</span>
              <span className="text-base font-extrabold text-purple-400">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Smart Split Calculator */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">Split Between Travelers</span>
              </div>
              <button
                type="button"
                onClick={handleShareSplitLink}
                className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium active:scale-95 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>
            </div>

            <div className="mb-3">
              <label className="block text-[10px] text-slate-400 mb-1">
                Number of Travelers:
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCompanions(n)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                      companions === n
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-purple-950/40 border border-purple-800/50 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-purple-300 block font-medium">Individual Share</span>
                <span className="text-sm font-extrabold text-white">
                  ₹{perPersonShare.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <span>₹{grandTotal.toLocaleString('en-IN')} ÷ {companions}</span>
              </div>
            </div>
          </div>

          {/* Payment Rails */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <span className="text-xs font-bold text-white block mb-2">
              Payment Rails
            </span>

            <div className="grid grid-cols-3 gap-2 mb-2.5">
              {[
                { id: 'upi' as const, label: 'UPI / QR', icon: QrCode },
                { id: 'card' as const, label: 'Cards', icon: CreditCard },
                { id: 'netbanking' as const, label: 'Net Banking', icon: Lock }
              ].map((m) => {
                const Icon = m.icon;
                const isSel = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-xl text-center border transition-all active:scale-95 ${
                      isSel
                        ? 'bg-purple-950/70 border-purple-500 text-white ring-1 ring-purple-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <span className="text-[11px] font-semibold">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 block mb-1">Select App:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'gpay' as const, name: 'Google Pay' },
                    { id: 'phonepe' as const, name: 'PhonePe' },
                    { id: 'paytm' as const, name: 'Paytm' }
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setUpiApp(app.id)}
                      className={`py-1 px-2 rounded-lg text-[10px] font-medium border text-center transition-all active:scale-95 ${
                        upiApp === app.id
                          ? 'bg-purple-900/60 border-purple-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatedCheckout}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 active:scale-95 transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Securing Itinerary...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Confirm & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/60 rounded-3xl p-5 max-w-xs w-full text-center shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-purple-600/40">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Your {canonicalTrip.destination} adventure is locked and synchronized.
            </p>

            <div className="bg-slate-950 rounded-xl p-3 text-left space-y-1.5 text-xs text-slate-300 mb-4 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking Ref:</span>
                <span className="font-mono text-purple-300">BMVG-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-bold text-white">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Travelers:</span>
                <span>{companions} Passengers</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowReceiptModal(false);
                setSubTab('timeline');
              }}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Back to Timeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
