import React, { useState } from 'react';
import { Wallet, Users, Share2, CheckCircle2, ShieldCheck, CreditCard, QrCode, ArrowRight, Lock, Check } from 'lucide-react';
import { CanonicalTrip } from '../types/trip';

interface TravelScreenProps {
  canonicalTrip: CanonicalTrip;
  onConfirmBooking: () => void;
}

export const TravelScreen: React.FC<TravelScreenProps> = ({
  canonicalTrip,
  onConfirmBooking
}) => {
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

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto scrollbar-thin pt-10 pb-28 px-4.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Split Ledger & Payment (TRAVEL-01)
          </h1>
          <span className="text-[11px] text-purple-400">
            Itemized Logistics & Shared Settlements
          </span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
          <Wallet className="w-4 h-4" />
        </div>
      </div>

      {shareToast && (
        <div className="mb-3 p-2.5 rounded-xl bg-purple-950/90 border border-purple-500 text-purple-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Split link & itemized tally copied to clipboard!</span>
        </div>
      )}

      {/* 1. Itemized Trip Ledger */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Itemized Trip Ledger
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
            {canonicalTrip.destination} ({canonicalTrip.days}D / {canonicalTrip.days - 1}N)
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
            <span>Estimated Local Cabs & Fuel</span>
            <span className="font-semibold text-white">₹{estimatedLocalCab.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Platform Assurance & GST</span>
            <span>₹{platformAssurance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-baseline justify-between">
          <span className="text-xs font-bold text-white uppercase">Grand Total</span>
          <span className="text-lg font-extrabold text-purple-400">
            ₹{grandTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 2. Smart Split Ledger */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Smart Split Calculator</span>
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

        {/* Companions Count Selector */}
        <div className="mb-3">
          <label className="block text-[11px] text-slate-400 mb-1.5">
            Number of Travelers Splitting:
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

        {/* Calculated per person share */}
        <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-purple-300 block font-medium">Equal Share Per Person</span>
            <span className="text-base font-extrabold text-white">
              ₹{perPersonShare.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="text-right text-[10px] text-slate-400">
            <span>₹{grandTotal.toLocaleString('en-IN')} ÷ {companions}</span>
          </div>
        </div>
      </div>

      {/* 3. Payment Rails */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-xl mb-4">
        <span className="text-xs font-bold text-white block mb-2.5">
          Select Payment Method
        </span>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-3">
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

        {/* Sub-options for UPI */}
        {paymentMethod === 'upi' && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-1">Instant UPI Apps:</span>
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
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all active:scale-95 ${
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

      {/* 4. Simulated Checkout Action */}
      <button
        type="button"
        disabled={isProcessing}
        onClick={handleSimulatedCheckout}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 active:scale-95 transition-all duration-150 disabled:opacity-50 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Locking Curated Itinerary...</span>
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5" />
            <span>Confirm & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
          </>
        )}
      </button>

      {/* Receipt Confirmation Modal */}
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
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all"
            >
              Back to My Trip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
