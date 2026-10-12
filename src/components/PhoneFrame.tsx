import React from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 md:p-6 lg:p-8 font-sans selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting for desktop viewport */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-fuchsia-900/15 rounded-full blur-3xl" />
      </div>

      {/* Desktop Brand Context Header */}
      <header className="hidden md:flex items-center justify-between w-full max-w-[390px] mb-4 z-10 text-slate-300 px-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-sm">BEEMVOYG</span>
            <span className="text-[10px] text-purple-400 font-medium block -mt-0.5">AI TRAVEL MVP</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stateless & RLS Isolated</span>
        </div>
      </header>

      {/* Strict Mobile Frame Profile (390 x 844 px) */}
      <div className="relative w-full h-[100dvh] md:w-[390px] md:h-[844px] bg-slate-900 md:rounded-[44px] shadow-2xl md:ring-1 md:ring-slate-800/80 overflow-hidden flex flex-col z-10 border-0 md:border-4 md:border-slate-800">
        
        {/* Dynamic Island / Speaker Pill for Mobile Frame on Desktop */}
        <div className="hidden md:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900/90 mr-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60" />
        </div>

        {/* Mobile Screen Shell with Safe Area Padding */}
        <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
          {children}
        </div>
      </div>

      {/* Desktop Helper note */}
      <footer className="hidden md:flex items-center gap-3 mt-4 text-[11px] text-slate-500 z-10">
        <span>390 × 844 px mobile viewport</span>
        <span>·</span>
        <span>India Curated Travel (Munnar, Goa, Jaipur)</span>
      </footer>
    </div>
  );
};
